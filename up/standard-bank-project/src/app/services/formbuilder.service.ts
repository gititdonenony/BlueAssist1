import { Injectable, isDevMode } from '@angular/core';
import { Platform } from '@ionic/angular';

import { File } from '@ionic-native/file/ngx';

import { ICameraCaptureInfo } from './models.service';
import { StorageService, Prefixes } from './storage.service';
import { MessageBusService } from './messagebus.service';
import { LoggerService } from './logger.service';

import JSZip from 'jszip';

export const ChunksDirectory = 'ImageChunks';
export const ChunkPrefix = 'AR_Form_Chunk_';

@Injectable()
export class FormBuilderService {
    private maxZipSize = 2; // In MegaBytes

    constructor(private file: File,
                private storage: StorageService,
                private messageBus: MessageBusService,
                private platform: Platform,
                private logger: LoggerService) {}

    async initialize() {
        if (!isDevMode() || this.platform.is('android')) {
            try {
                let dirExists = true;
                try {
                    dirExists = await this.file.checkDir(this.file.dataDirectory, ChunksDirectory);
                } catch (err) {
                    dirExists = false;
                }
                if (!dirExists) {
                    await this.file.createDir(this.file.dataDirectory, ChunksDirectory, false);
                }
                dirExists = true;
                try {
                    dirExists = await this.file.checkDir(this.file.dataDirectory, 'thumbnails');
                } catch (err) {
                    dirExists = false;
                }
                if (!dirExists) {
                    await this.file.createDir(this.file.dataDirectory, 'thumbnails', false);
                }
            } catch (err) {
                this.logger.error('FormBuilderService::initialize', err);
            }
        }

        this.messageBus.subscribeToImageSavedEvent().subscribe(async (event) => {
            const chunkInfos = await this.storage.get(Prefixes.ImageChunkInfo, []);
            const newChunkInfos = await this.updateImageChunks(event.StorageKey, event.CaptureInfo, chunkInfos);
            await this.storage.set(Prefixes.ImageChunkInfo, newChunkInfos);
        });
    }

    async updateImageChunks(storageKey: string, captureInfo: ICameraCaptureInfo, chunkInfos: ImageChunkInfo[]) {
        try {
            const fileSize = await this.getFileSize(captureInfo);
            const nextAvailableZip = this.getNextAvailableZipFile(chunkInfos, fileSize);
            const existingZipEntry = chunkInfos.find(x => x.StorageKey === storageKey);
            if (existingZipEntry) {
                await this.deleteZipEntry(existingZipEntry.ZipPath, existingZipEntry.ZipEntryName);
                chunkInfos.splice(chunkInfos.indexOf(existingZipEntry), 1);
            }

            const zipFile = await this.retrieveZip(nextAvailableZip);
            const zipEntryName = this.getFullFilePath(storageKey, captureInfo);
            const zipEntryArrayBuffer = await this.retrievePhoto(captureInfo);
            await zipFile.file(zipEntryName, zipEntryArrayBuffer, {
                binary: true,
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9
                },
                createFolders: true
            });
            await this.saveZip(nextAvailableZip, zipFile);
            chunkInfos.push({
                FileSize: fileSize,
                StorageKey: storageKey,
                ZipEntryName: zipEntryName,
                ZipPath: nextAvailableZip
            });
            return chunkInfos;
        } catch (err) {
            this.logger.error('FormBuilderService::updateImageChunks', err);
        }
    }

    async getFileSize(cameraCaptureInfo: ICameraCaptureInfo): Promise<number> {
        try {
            const dir = await this.file.resolveDirectoryUrl(cameraCaptureInfo.Directory);
            const file = await this.file.getFile(dir, cameraCaptureInfo.FileName, { create: false });
            return new Promise((resolve) => {
                file.getMetadata((data) => {
                    resolve(data.size);
                }, (err) => {
                    console.log(err);
                    resolve(null);
                });
            });
        } catch (err) {
            this.logger.error('FormBuilderService::getFileSize', err);
            return null;
        }
    }

    /**
     * Gets the file size of a Zip Chunk
     * @param chunkInfo Stored Chunk Info
     */
    async getZipChunkSize(zipPath: string): Promise<number> {
        try {
            const dir = await this.file.resolveDirectoryUrl(this.file.dataDirectory);
            const file = await this.file.getFile(dir, `${ChunksDirectory}/${zipPath}`, { create: false });
            return new Promise((resolve) => {
                file.getMetadata((data) => {
                    resolve(data.size);
                }, (err) => {
                    console.log(err);
                    resolve(0);
                });
            });
        } catch (err) {
            this.logger.error('FormBuilderService::getZipChunkSize', err);
            return 0;
        }
    }

    /**
     * Retrieve a Zip Chunk as Base64
     * @param zipPath Path of the Zip Chunk File
     */
    async getZipAsArrayBuffer(zipPath: string): Promise<ArrayBuffer> {
        try {
            const doesExist = await this.file.checkFile(`${this.file.dataDirectory}${ChunksDirectory}/`,
                                                        zipPath);
            if (!doesExist) {
                console.warn(`Zip Chunk ${this.file.dataDirectory}${ChunksDirectory}/${zipPath} does not exist`);
                return null;
            }

            return await this.file.readAsArrayBuffer(`${this.file.dataDirectory}${ChunksDirectory}/`, zipPath);
        } catch (err) {
            this.logger.error('FormBuilderService::getZipAsArrayBuffer', err);
            return null;
        }
    }

    /**
     * Deletes all current AR Storage objects
     */
    async deleteCurrentForm() {
        const currentStates = await this.storage.startsWith(Prefixes.PageButtonStates);
        for (const state of currentStates) {
            await this.storage.delete(state.Key);
        }

        (async () => {
            try {
                await this.storage.delete(Prefixes.ARFormInput);
                await this.deleteChunks();

                const savedImages: ICameraCaptureInfo[] = [];
                const accidentSceneImages = await this.storage.startsWith(Prefixes.AccidentSceneCapture);
                const evidence = await this.storage.startsWith(Prefixes.Evidence);
                const myVehicleDamages = await this.storage.startsWith(Prefixes.MyVehicleDamages);
                const theirVehicleDamages = await this.storage.startsWith(Prefixes.TheirVehicleDamages);

                accidentSceneImages.forEach(x => savedImages.push(x.Value));
                evidence.forEach(x => savedImages.push(x.Value));
                myVehicleDamages.forEach(x => savedImages.push(x.Value));
                theirVehicleDamages.forEach(x => savedImages.push(x.Value));

                const cyclistInfo = await this.storage.startsWith(Prefixes.CyclistInfo);
                const imageChunkInfo = await this.storage.startsWith(Prefixes.ImageChunkInfo);
                const passengerInfo = await this.storage.startsWith(Prefixes.PassengerInfo);
                const pedestrianInfo = await this.storage.startsWith(Prefixes.PedestrianInfo);
                const savedCyclists = await this.storage.startsWith(Prefixes.SavedCyclists);
                const savedPassengers = await this.storage.startsWith(Prefixes.SavedPassengers);
                const savedPedestrians = await this.storage.startsWith(Prefixes.SavedPedestrians);

                const keysToDelete = [];
                accidentSceneImages.forEach(x => keysToDelete.push(x.Key));
                cyclistInfo.forEach(x => keysToDelete.push(x.Key));
                evidence.forEach(x => keysToDelete.push(x.Key));
                imageChunkInfo.forEach(x => keysToDelete.push(x.Key));
                myVehicleDamages.forEach(x => keysToDelete.push(x.Key));
                passengerInfo.forEach(x => keysToDelete.push(x.Key));
                pedestrianInfo.forEach(x => keysToDelete.push(x.Key));
                savedCyclists.forEach(x => keysToDelete.push(x.Key));
                savedPassengers.forEach(x => keysToDelete.push(x.Key));
                savedPedestrians.forEach(x => keysToDelete.push(x.Key));
                theirVehicleDamages.forEach(x => keysToDelete.push(x.Key));

                for (const key of keysToDelete) {
                    await this.storage.delete(key);
                }

                await this.deleteSavedImages(savedImages);
            } catch (err) {
                this.logger.error('FormBuilderService::deleteCurrentForm', err);
            }
        })();
    }

    private async deleteChunks() {
        try {
            await this.file.removeRecursively(`${this.file.dataDirectory}`, ChunksDirectory);
        } catch (err) {
            this.logger.error('FormBuilderService::deleteChunks::delete', err);
        }

        try {
            await this.file.createDir(this.file.dataDirectory, ChunksDirectory, true);
        } catch (err) {
            this.logger.error('FormBuilderService::deleteChunks::create', err);
        }
    }

    private async deleteSavedImages(savedImages: ICameraCaptureInfo[]) {
        for (const savedImage of savedImages) {
            try {
                await this.file.removeFile(savedImage.Directory, savedImage.FileName);
            } catch (err) {
                this.logger.error('FormBuilderService::deleteSavedImages', err);
            }
        }
    }

    private async retrievePhoto(cameraCaptureInfo: ICameraCaptureInfo): Promise<ArrayBuffer> {
        try {
            const doesExist = await this.file.checkFile(cameraCaptureInfo.Directory,
                                                        cameraCaptureInfo.FileName);
            if (!doesExist) {
                console.warn(`File ${cameraCaptureInfo.FullPath} does not exist`);
                return null;
            }

            return await this.file.readAsArrayBuffer(cameraCaptureInfo.Directory,
                                                    cameraCaptureInfo.FileName);
        } catch (err) {
            this.logger.error('FormBuilderService::retrievePhoto', err);
            return null;
        }
    }

    private getNextAvailableZipFile(chunkInfos: ImageChunkInfo[], includeAdditionalFileSize: number) {
        try {
            const zipChunkIds = [];
            chunkInfos.forEach(x => {
                const zipParts = x.ZipPath.split('_');
                const zipId = parseInt(zipParts[zipParts.length - 1].split('.')[0], 0);
                zipChunkIds.push(zipId);
            });
            if (zipChunkIds.length === 0) {
                zipChunkIds.push(0);
            }
            zipChunkIds.sort((a, b) => b > a ? 1 : -1);
            const nextAvaialbleZip = chunkInfos.find(x => x.ZipPath.endsWith(`${zipChunkIds[0]}.zip`));
            const currentZipSize = nextAvaialbleZip ? this.getZipSize(chunkInfos, nextAvaialbleZip.ZipPath) : 0;

            if (nextAvaialbleZip && ((currentZipSize + includeAdditionalFileSize) / 1000000) <= this.maxZipSize) {
                return nextAvaialbleZip.ZipPath;
            } else {
                return `${ChunkPrefix}${zipChunkIds[0] + 1}.zip`;
            }
        } catch (err) {
            this.logger.error('FormBuilderService::getNextAvailableZipFile', err);
        }
    }

    private getZipSize(chunkInfos: ImageChunkInfo[], zipName: string): number {
        const availableZipEntries = chunkInfos.filter(x => x.ZipPath === zipName);
        let currentZipSize = 0;
        availableZipEntries.forEach(x => {
            currentZipSize += x.FileSize;
        });
        return currentZipSize;
    }

    private async deleteZipEntry(zipPath: string, zipEntryName: string): Promise<boolean> {
        try {
            const loadedZip = await this.retrieveZip(zipPath);
            await loadedZip.remove(zipEntryName);
            await this.saveZip(zipPath, loadedZip);
            return true;
        } catch (err) {
            this.logger.error('FormBuilderService::deleteZipEntry', err);
        }
    }

    private async retrieveZip(zipPath: string): Promise<any> {
        try {
            const doesExist = await this.file.checkFile(`${this.file.dataDirectory}${ChunksDirectory}/`,
                zipPath);
            if (!doesExist) {
                console.warn(`Zip ${this.file.dataDirectory}${ChunksDirectory}/${zipPath} does not exist`);
                return new JSZip();
            }

            const zipArrayBuffer = await this.file.readAsArrayBuffer(`${this.file.dataDirectory}${ChunksDirectory}/`,
                zipPath);

            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(zipArrayBuffer, { createFolders: true });
            return loadedZip;
        } catch (err) {
            this.logger.error('FormBuilderService::retrieveZip', err);
            return new JSZip();
        }
    }

    private async saveZip(zipName: string, zipArchive: any) {
        try {
            const zipContent = await zipArchive.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9
                }
            });

            const result = await this.file.writeFile(`${this.file.dataDirectory}${ChunksDirectory}/`,
                                                    zipName,
                                                    zipContent,
                                                    {
                                                        replace: true
                                                    });
        } catch (err) {
            this.logger.error('FormBuilderService::saveZip', err);
        }
    }

    private getFullFilePath(storageKey: string, captureInfo: ICameraCaptureInfo) {
        let folderName = '';
        let fileName = '';
        if (storageKey.startsWith(Prefixes.AccidentSceneCapture)) {
            folderName = 'Accident Scene/';
            fileName = storageKey.replace(Prefixes.AccidentSceneCapture, '');
        } else if (storageKey.startsWith(Prefixes.MyVehicleDamages)) {
            folderName = 'My Vehicle Damages/';
            fileName = storageKey.replace(Prefixes.MyVehicleDamages, '');
        } else if (storageKey.startsWith(Prefixes.TheirVehicleDamages)) {
            folderName = 'Other Vehicle Damages/';
            fileName = storageKey.replace(Prefixes.TheirVehicleDamages, '');
        } else if (storageKey.startsWith(Prefixes.Evidence)) {
            folderName = 'Road Conditions Evidence/';
            fileName = storageKey.replace(Prefixes.Evidence, '');
        }

        const fileExtention = captureInfo.FileName.split('.')[1];
        fileName = `${fileName.replace('/', '-')}.${fileExtention}`;

        return `${folderName}${fileName}`;
    }
}

export interface ImageChunkInfo {
    StorageKey: string;
    ZipEntryName: string;
    ZipPath: string;
    FileSize: number;
}
