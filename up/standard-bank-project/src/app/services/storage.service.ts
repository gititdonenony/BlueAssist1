import { Injectable, isDevMode } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { ICameraCaptureInfo } from './models.service';
import { LoggerService } from './logger.service';

@Injectable()
export class StorageService {

    constructor(private storage: Storage,
        private platform: Platform,
        private logger: LoggerService) {
        this.storage.create();
    }

    /**
     * Store data in storage
     * @param key The Key of the data being stored
     * @param data The data to store
     */
    async set(key: string, data: any): Promise<boolean> {
        try {
            await this.storage.set(key, data);
            return true;
        } catch (err) {
            this.logger.error('StorageService::set', err);
            return false;
        }
    }

    /**
     * Saves an AR Form Input value against it's FieldId
     * @param fieldId FieldId of the AR Form Input
     * @param data Data to save
     */
    async setARFormInput(fieldId: number, data: any): Promise<boolean> {
        try {
            const arFormSavedInputs = await this.get(Prefixes.ARFormInput, {});
            arFormSavedInputs[fieldId] = data;
            await this.set(Prefixes.ARFormInput, arFormSavedInputs);
        } catch (err) {
            this.logger.error('StorageService::setARFormInput', err);
            return false;
        }
    }

    /**
     * Retrieves an item from storage
     * @param key Storage Key to get
     * @param fallback Default value to return if the key does not exist
     */
    async get(key: string, fallback?: any): Promise<any> {
        try {
            const data = await this.storage.get(key);
            return data === null ? fallback : data;
        } catch (err) {
            this.logger.error('StorageService::get', err);
            return fallback;
        }
    }

    /**
     * Retrieves AR Form Inputs from storage
     * @param fieldIds FieldId's to retrieve
     */
    async getARFormInput(fieldId: number): Promise<any> {
        try {
            const data = await this.get(Prefixes.ARFormInput, {});
            return data[fieldId];
        } catch (err) {
            this.logger.error('StorageService::getARFormInput', err);
            return {};
        }
    }

    /**
     * Retrieves an item from storage and maps to interface
     * @param key Storage Key to get
     */
    async getInstance<T>(key: string): Promise<T> {
        try {
            const data = await this.storage.get(key) as T;
            return data;
        } catch (err) {
            this.logger.error('StorageService::getInstance', err);
            return null;
        }
    }

    /**
     * Deletes an item from storage
     * @param key Storage Key to delete
     */
    async delete(key: string): Promise<boolean> {
        try {
            await this.storage.remove(key);
            return true;
        } catch (err) {
            this.logger.error('StorageService::delete', err);
            return false;
        }
    }

    /**
     * Deletes a AR Form Input from storage
     * @param fieldId FieldId to Delete
     */
    async deleteARFormInput(fieldId: number): Promise<boolean> {
        try {
            const data = await this.get(Prefixes.ARFormInput, {});
            delete data[fieldId];
            await this.set(Prefixes.ARFormInput, data);
            return true;
        } catch (err) {
            this.logger.error('StorageService::deleteARFormInput', err);
            return false;
        }
    }

    /**
     * Saves an Image Capture Details in Storage
     * @param key Storage Key to save image info as
     * @param captureInfo The Camera Capture Info that should be saved
     */
    async saveImageCaptureInfo(key: string, captureInfo: ICameraCaptureInfo): Promise<boolean> {
        try {
            if (!isDevMode() || this.platform.is('android')) {
                captureInfo.Base64 = '';
            }
            return await this.set(key, captureInfo);
        } catch (err) {
            this.logger.error('StorageService::saveImageCaptureInfo', err);
            return false;
        }
    }

    /**
     * Retrieves all items from storage that starts with a cerain value
     * @param prefix Prefix Key to search for
     * @param filter Filter aggregate to apply when searching for keys
     */
    async startsWith(prefix: string, filter?: (value: string) => boolean): Promise<StartWithMatch[]> {
        try {
            const keysStartingWith = [];
            const allKeys = await this.storage.keys();
            if (filter) {
                allKeys.filter(filter).forEach(x => {
                    if (x.startsWith(prefix)) {
                        keysStartingWith.push(x);
                    }
                });
            } else {
                allKeys.forEach(x => {
                    if (x.startsWith(prefix)) {
                        keysStartingWith.push(x);
                    }
                });
            }

            const resultTasks = [];
            keysStartingWith.forEach(x => {
                resultTasks.push({ StorageKey: x, Task: this.get(x) });
            });
            const result: StartWithMatch[] = [];
            for (const task of resultTasks) {
                const taskResult = await task.Task;
                result.push({ Key: task.StorageKey, Value: taskResult });
            }
            return result;
        } catch (err) {
            this.logger.error('StorageService::startsWith', err);
            return null;
        }
    }

    /**
     * Retrieves multiple AR Form Inputs from storage
     * @param fieldIds FieldId's to retrieve
     */
    async getBulkARFormInputs(fieldIds: number[]): Promise<any> {
        try {
            const data = await this.get(Prefixes.ARFormInput, {});
            const returnData = {};
            for (const fieldId in data) {
                if (!fieldIds || fieldIds.indexOf(parseInt(fieldId, 0)) > -1) {
                    returnData[fieldId] = data[fieldId];
                }
            }
            return returnData;
        } catch (err) {
            this.logger.error('StorageService::getBulkARFormInputs', err);
            return {};
        }
    }

    /**
     * Inserts multiple AR Form inputs into storage
     * @param inputs Inputs to insert { 'fieldId': 'value' }
     */
    async insertBulkARFormInputs(inputs: any): Promise<boolean> {
        try {
            const data = await this.get(Prefixes.ARFormInput, {});
            for (const fieldId in inputs) {
                if (fieldId) {
                    data[fieldId] = inputs[fieldId];
                }
            }
            await this.set(Prefixes.ARFormInput, data);
            return true;
        } catch (err) {
            this.logger.error('StorageService::insertBulkARFormInputs', err);
            return false;
        }
    }

    /**
     * Deletes mutiple AR Form inputs from storage
     * @param inputs Array of FieldId's to delete
     */
    async deleteBulkARFormInputs(inputs: number[]): Promise<boolean> {
        try {
            const data = await this.get(Prefixes.ARFormInput, {});
            inputs.forEach(x => {
                delete data[x];
            });
            await this.set(Prefixes.ARFormInput, data);
        } catch (err) {
            this.logger.error('StorageService::deleteBulkARFormInputs', err);
            return false;
        }
    }

    async isLoggedIn(): Promise<boolean> {
        try {
            const userDetail = await this.get(Tables.UserDetails);
            if (userDetail) {
                return true;
            }
            return false;
        } catch (err) {
            this.logger.error('StorageService::isLoggedIn', err);
            return false;
        }
    }
}

export interface StartWithMatch {
    Key: string;
    Value: any;
}

export enum Prefixes {
    ARFormInput = 'AR_Form_Input_',
    MyVehicleDamages = 'Vehicle_Damage_MY_',
    TheirVehicleDamages = 'Vehicle_Damage_THEIR_',
    AccidentSceneCapture = 'AccidentScene_',
    Evidence = 'Evidence_',
    PageButtonStates = 'Page_Button_State_',
    PassengerInfo = 'Passenger_Info',
    CyclistInfo = 'Cyclist_Info',
    PedestrianInfo = 'Pedestrian_Info',
    SavedPassengers = 'Saved_Passengers',
    SavedCyclists = 'Saved_Cyclists',
    SavedPedestrians = 'Saved_Pedestrains',
    ImageChunkInfo = 'Image_Chunk_Info',
    ArFormHistoryDetail = 'Ar_Form_History_'
}

export enum Tables {
    AcceptedTermsAndConditions = 'AcceptedT&C',
    LocationInformation = 'LocationInformation',
    ARFormHistory = 'ARFormHistory',
    UserDetails = 'UserDetails',
    PushNotificationId = 'PushID'
}
