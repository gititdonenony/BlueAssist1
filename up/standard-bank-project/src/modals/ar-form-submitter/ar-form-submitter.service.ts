import { Injectable, EventEmitter, isDevMode } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';

import { File } from '@ionic-native/file/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Geoposition } from '@ionic-native/geolocation/ngx';

import { StorageService, Prefixes, Tables } from 'src/app/services/storage.service';
import { GlobalService } from 'src/app/services/global.service';
import { FormBuilderService, ImageChunkInfo } from 'src/app/services/formbuilder.service';
import { IPassenger, SeverityOfInjury, IPassengerSavedInfo, ILocationInformation, IArFormHistory, IUserModel } from 'src/app/services/models.service';
import { HttpService } from 'src/app/services/http.service';
import { PageBuilderService } from 'src/app/services/pagebuilder.service';
import { MessageBusService } from 'src/app/services/messagebus.service';
import { LoggerService } from 'src/app/services/logger.service';
import { SelectOthersInvolvedPage } from '../../modals/select-others-involved/select-others-involved.page';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable()
export class ArFormSubmitterService {

    private svgElement: SVGElement;
    private circleElement: SVGCircleElement;
    private circleCircumfrence: number;
    private currentPercentage = 0;
    private currentStage = 'Building';
    private progressEvent: EventEmitter<ProgressEvent> = new EventEmitter();

    private formContent: FormInput[] = [];
    private zipChunks: string[] = [];

    constructor(private storage: StorageService,
                private global: GlobalService,
                private alertController: AlertController,
                private modalController: ModalController,
                private file: File,
                private formBuilder: FormBuilderService,
                private network: Network,
                private http: HttpService,
                private device: Device,
                private appVersion: AppVersion,
                private pageBuilder: PageBuilderService,
                private nav: NavController,
                private messageBus: MessageBusService,
                private logger: LoggerService) { }

    progressEventChanged(): Observable<ProgressEvent> {
        return this.progressEvent.asObservable();
    }

    initialize() {
        try {
            this.svgElement = document.querySelector('.progress-ring') as SVGElement;
            this.circleElement = document.querySelector('.progress-ring-circle') as SVGCircleElement;
            const radius = Math.floor((this.svgElement.clientWidth / 2) - 12);
            const cxy = Math.floor(this.svgElement.clientWidth / 2);

            this.circleCircumfrence = radius * 2 * Math.PI;
            this.circleElement.style.strokeDasharray = `${this.circleCircumfrence} ${this.circleCircumfrence}`;
            this.circleElement.style.strokeDashoffset = `${this.circleCircumfrence}`;
            this.circleElement.setAttribute('r', radius.toString());
            this.circleElement.setAttribute('cx', cxy.toString());
            this.circleElement.setAttribute('cy', cxy.toString());

            const showError = async () => {
                await this.global.toast('Something went wrong. Please try again in a few minutes.');
                await this.modalController.dismiss();
            };

            const showSuccess = async () => {
                await this.global.toast('Email was sent. Please check your inbox.');
                await this.modalController.dismiss();
                await this.nav.navigateRoot('/home/start');
                setTimeout(async () => {
                    await this.nav.navigateForward('/tabs/profile');
                }, 300);
            };

            setTimeout(() => {
                (async () => {
                    try {
                        this.svgElement.style.opacity = '1';
                        this.currentPercentage = 0;
                        // this.setProgress();
                        const validateFormResult = await this.validateForm();
                        if (!validateFormResult) {
                            await showError();
                            return;
                        }

                        const buildFormResult = await this.buildFormJsonContent();
                        if (!buildFormResult) {
                            await showError();
                            return;
                        }

                        const extractResult = await this.extractAndValidateZipChunks();
                        if (!extractResult) {
                            await showError();
                            return;
                        }

                        this.currentStage = 'Emailing';
                        this.currentPercentage = 0;
                        // this.setProgress();

                        // const chunkKeys = await this.uploadChunks();
                        // if (!chunkKeys || chunkKeys.length === 0) {
                        //     await showError();
                        //     return;
                        // }

                        // const validationResult = await this.uploadFormData(chunkKeys);
                        // if (!validationResult) {
                        //     await showError();
                        //     return;
                        // }

                        // await this.setUserDetails(validationResult.User);

                        // await this.cleanupFormAndSaveToHistory(validationResult.FormId);

                        // const isLoggedIn = await this.storage.isLoggedIn();
                        // if (!isLoggedIn) {
                        //     await this.promptPasswordChange(validationResult);
                        // }

                        await showSuccess();
                    } catch (err) {
                        this.logger.error('ArFormSubmitterService::initialize::timeout', err);
                    }
                })();
            }, 500);
        } catch (err) {
            this.logger.error('ArFormSubmitterService::initialize', err);
        }
    }

    private async setUserDetails(userDetails: IUserModel) {
        try {
            await this.storage.set(Tables.UserDetails, userDetails);
            this.messageBus.sendMessageToUserLoginChangeMessageBus();
        } catch (err) {
            this.logger.error('ArFormSubmitterService::setUserDetails', err);
        }
    }

    private async promptPasswordChange(validationResult: IFormValidationResult) {
        const subHeaderMessage = `Hey ${validationResult.User.Name}!`;
        const promptMessage = `We created a user for you in order to retrieve your data later on from any device.
        Your password was defaulted to your SA ID Number, but you can change it below if you want to :)`;
        const passwordPrompt = await this.alertController.create({
            animated: true,
            backdropDismiss: true,
            message: promptMessage,
            inputs: [
                {
                    type: 'password',
                    placeholder: 'New Password',
                    label: 'New Password',
                    name: 'password'
                }
            ],
            buttons: [
                {
                    text: 'Leave as is',
                    role: 'cancel'
                },
                {
                    text: 'Change Password',
                    role: 'success'
                }
            ],
            cssClass: 'invert',
            subHeader: subHeaderMessage
        });
        await passwordPrompt.present();

        const result = await passwordPrompt.onDidDismiss();
        if (result.role === 'success' && (!result.data || !result.data.values.password)) {
            await this.global.toast('Please enter a value in the password input field');
            await this.promptPasswordChange(validationResult);
        } else if (result.role === 'success') {
            const newPassword = result.data.values.password;
            this.changeUserPassword(validationResult.User.Id, newPassword);
        }
    }

    private changeUserPassword(userId: string, newPassword: string) {
        this.http.put('/users/v1/changepassword', {
            UserId: userId,
            Password: newPassword
        }).catch(err => {
            this.logger.error('ArFormSubmitterService::changeUserPassword', err);
        });
    }

    private async cleanupFormAndSaveToHistory(formId: string) {
        try {
            const formHistoryEntry: IArFormHistory = {
                AccidentDate: 'Unknown',
                AccidentType: 'Unknown',
                FormId: formId,
                LocationOfAccident: 'Unknown',
                OtherDriverFullName: 'Unknown'
            };

            const accidentDate = this.formContent.find(x => x.FieldId === 1);
            if (accidentDate) {
                formHistoryEntry.AccidentDate = moment(accidentDate.Value).format('DD MMM YYYY');
            }

            const location = await this.storage.get(Tables.LocationInformation) as ILocationInformation;
            if (location && location.Address) {
                formHistoryEntry.LocationOfAccident = location.Address;
            }

            const accidentType = this.formContent.find(x => x.FieldId === 114);
            if (accidentType) {
                const accidentTypeOptions = this.pageBuilder.accidentTypeOptions();
                const selectedAccidentType = accidentTypeOptions.find(x => x.ID === parseInt(accidentType.Value, 0));
                if (selectedAccidentType) {
                    formHistoryEntry.AccidentType = selectedAccidentType.Description;
                }
            }

            const otherDriverName = this.formContent.find(x => x.FieldId === 56);
            const otherDriverSurname = this.formContent.find(x => x.FieldId === 55);
            if (otherDriverName && otherDriverSurname) {
                formHistoryEntry.OtherDriverFullName = `${otherDriverName.Value} ${otherDriverSurname.Value}`;
            }

            const otherHistory: IArFormHistory[] = await this.storage.get(Tables.ARFormHistory, []);
            otherHistory.push(formHistoryEntry);
            await this.storage.set(Tables.ARFormHistory, otherHistory);
            await this.formBuilder.deleteCurrentForm();
        } catch (err) {
            this.logger.error('ArFormSubmitterService::cleanupFormAndSaveToHistory', err);
        }
    }

    //#region =============== Validate Form Methods ===============
    /**
     * Aggregates all the validation methods
     */
    async validateForm(): Promise<boolean> {
        try {
            // Validate 'Other People Involved' information
            await this.validatePassengerSection();
            // Validate Personal Information
            await this.validatePersonalInfo();

            // Set Number of cars involved in Accident. This is hardcoded for now...
            await this.storage.setARFormInput(3, 2);
            return true;
        } catch (err) {
            this.logger.error('ArFormSubmitterService::validateForm', err);
            return false;
        }
    }

    /**
     * Validate 'Other People Involved' information and check that maximum amount is not exceeded
     */
    private async validatePassengerSection() {
        try {
            const passengersInvolved: IPassenger[] = await this.storage.getInstance<IPassenger[]>(Prefixes.PassengerInfo);
            const cyclistsInvolved: IPassenger[] = await this.storage.getInstance<IPassenger[]>(Prefixes.CyclistInfo);
            const pedestriansInvolved: IPassenger[] = await this.storage.getInstance<IPassenger[]>(Prefixes.PedestrianInfo);

            // this.increaseAndUpdateProgress(1.666);

            let notInjured = [];
            let injured = [];

            if (passengersInvolved) {
                passengersInvolved.forEach(x => {
                    if (x.InjuryType === SeverityOfInjury.NoInjury) {
                        notInjured.push({ Type: 'Passenger', Data: x });
                    } else {
                        injured.push({ Type: 'Passenger', Data: x });
                    }
                });
            }
            if (cyclistsInvolved) {
                cyclistsInvolved.forEach(x => {
                    if (x.InjuryType === SeverityOfInjury.NoInjury) {
                        notInjured.push({ Type: 'Cyclist', Data: x });
                    } else {
                        injured.push({ Type: 'Cyclist', Data: x });
                    }
                });
            }
            if (pedestriansInvolved) {
                pedestriansInvolved.forEach(x => {
                    if (x.InjuryType === SeverityOfInjury.NoInjury) {
                        notInjured.push({ Type: 'Pedestrian', Data: x });
                    } else {
                        injured.push({ Type: 'Pedestrian', Data: x });
                    }
                });
            }

            if (notInjured.length > 3 || injured.length > 4) {
                const selectInvolvedModal = await this.global.modal(SelectOthersInvolvedPage, {
                    injuredPeople: injured,
                    notInjuredPeople: notInjured
                }, 'small-popup');

                const result = await selectInvolvedModal.onDidDismiss();
                if (notInjured.length > 3) {
                    notInjured = result.data.NotInjured;
                }
                if (injured.length > 4) {
                    injured = result.data.Injured;
                }
            }

            // this.increaseAndUpdateProgress(1.666);

            await this.setPassengerData(notInjured, injured);

            this.currentPercentage = 5;
            // this.setProgress();
        } catch (err) {
            this.logger.error('ArFormSubmitterService::validatePassengerSection', err);
        }
    }
    /**
     * Saves the Other People Involved data
     * @param notInjured People who was not injured
     * @param injured People who was injured or killed
     */
    private async setPassengerData(notInjured: { Type: string, Data: IPassenger }[], injured: { Type: string, Data: IPassenger }[]) {
        try {
            const infoToSet = {};
            let jumpAmount = 8;
            for (let i = 0; i < notInjured.length; i++) {
                const prefix = notInjured[i].Type === 'Passenger' ? Prefixes.SavedPassengers : notInjured[i].Type === 'Cyclist' ? Prefixes.SavedCyclists : Prefixes.SavedPedestrians;
                const personDatas = await this.storage.getInstance<IPassengerSavedInfo[]>(prefix);
                if (personDatas && personDatas.length > 0) {
                    const personData = personDatas.find(x => x.ID === notInjured[i].Data.ID);
                    if (personData) {
                        infoToSet[(122 + jumpAmount * i)] = personData.Info.Surname;
                        infoToSet[(126 + jumpAmount * i)] = personData.Info.IDNumber;
                        infoToSet[(127 + jumpAmount * i)] = personData.Info.CellNumber;
                    }
                }
            }

            jumpAmount = 21;
            for (let i = 0; i < injured.length; i++) {
                const prefix = injured[i].Type === 'Passenger' ? Prefixes.SavedPassengers : injured[i].Type === 'Cyclist' ? Prefixes.SavedCyclists : Prefixes.SavedPedestrians;
                const personDatas = await this.storage.getInstance<IPassengerSavedInfo[]>(prefix);
                if (personDatas && personDatas.length > 0) {
                    const personData = personDatas.find(x => x.ID === injured[i].Data.ID);
                    if (personData) {
                        infoToSet[(150 + jumpAmount * i)] = personData.Info.IDNumber;
                        infoToSet[(151 + jumpAmount * i)] = personData.Info.CountryOfOrigin;
                        infoToSet[(152 + jumpAmount * i)] = personData.Info.Surname;
                        infoToSet[(153 + jumpAmount * i)] = personData.Info.Initials;
                        infoToSet[(154 + jumpAmount * i)] = personData.Info.Age;
                        infoToSet[(155 + jumpAmount * i)] = personData.Info.HomeAddress;
                        infoToSet[(159 + jumpAmount * i)] = personData.Info.CellNumber;
                        infoToSet[(160 + jumpAmount * i)] = personData.Info.Race;
                        infoToSet[(161 + jumpAmount * i)] = personData.Info.Gender;
                        infoToSet[(162 + jumpAmount * i)] = personData.Info.DriverInjured;
                        infoToSet[(163 + jumpAmount * i)] = personData.Info.SeatbeltFitted;
                        infoToSet[(164 + jumpAmount * i)] = personData.Info.SeatbeltUsed;
                        infoToSet[(165 + jumpAmount * i)] = personData.Info.LiquorSuspected;
                        infoToSet[(166 + jumpAmount * i)] = personData.Info.LiquorTested;
                    }
                }
            }

            const killedAmount = injured.filter(x => x.Data.InjuryType === SeverityOfInjury.Killed).length;
            const seriousAmount = injured.filter(x => x.Data.InjuryType === SeverityOfInjury.Serious).length;
            const slightAmount = injured.filter(x => x.Data.InjuryType === SeverityOfInjury.Slight).length;
            const notInjuredAmount = notInjured.length;

            infoToSet[118] = killedAmount;
            infoToSet[119] = seriousAmount;
            infoToSet[120] = slightAmount;
            infoToSet[121] = notInjuredAmount;

            await this.storage.insertBulkARFormInputs(infoToSet);
        } catch (err) {
            this.logger.error('ArFormSubmitterService::setPassengerData', err);
        }
    }

    /**
     * Validates Personl Informationa and ensures the minimal info is completed
     */
    private async validatePersonalInfo() {
        try {
            const savedInfo = await this.storage.getBulkARFormInputs([31, 30, 27]);

            let fullName = savedInfo[31];
            let surname = savedInfo[30];
            let idNumber = savedInfo[27];

            if (!fullName || !surname || !idNumber) {
                const userDetails = await this.checkSavedPersonalInfo();
                if (userDetails) {
                    if (!fullName && userDetails.Name) {
                        fullName = userDetails.Name;
                    }
                    if (!surname && userDetails.Surname) {
                        surname = userDetails.Surname;
                    }
                    if (!idNumber && userDetails.IDNumber) {
                        idNumber = userDetails.IDNumber;
                    }
                }
            }

            // this.increaseAndUpdateProgress(1.666);

            while (!fullName || !surname || !idNumber) {
                const questions = [];
                if (!fullName) {
                    questions.push({
                        type: 'text',
                        name: 'fullName',
                        label: 'Name',
                        placeholder: 'Name',
                    });
                }
                if (!surname) {
                    questions.push({
                        type: 'text',
                        name: 'surname',
                        label: 'Surname',
                        placeholder: 'Surname',
                    });
                }
                if (!idNumber) {
                    questions.push({
                        type: 'tel',
                        name: 'idNumber',
                        label: 'ID Number',
                        placeholder: 'ID Number',
                    });
                }
                const alertInstance = await this.alertController.create({
                    animated: true,
                  
                    backdropDismiss: false,
                    message: 'Some important info is missing. Please complete below to continue:',
                    buttons: [
                        {
                            text: 'Continue',
                            role: 'continue'
                        }
                    ],
                    cssClass: 'basic-alert',
                    inputs: questions
                });
                await alertInstance.present();
                const alertData = await alertInstance.onDidDismiss();
                if (alertData.data.values.fullName) {
                    fullName = alertData.data.values.fullName;
                }
                if (alertData.data.values.surname) {
                    surname = alertData.data.values.surname;
                }
                if (alertData.data.values.idNumber) {
                    idNumber = alertData.data.values.idNumber;
                }
            }

            // this.increaseAndUpdateProgress(1.666);

            const infoToSave = {};

            infoToSave[31] = fullName;
            infoToSave[30] = surname;
            infoToSave[27] = idNumber;

            await this.storage.insertBulkARFormInputs(infoToSave);

            this.currentPercentage = 10;
            // this.setProgress();
        } catch (err) {
            this.logger.error('ArFormSubmitterService::validatePersonalInfo', err);
        }
    }
    private async checkSavedPersonalInfo() {
        try {
            const userDetails: IUserModel = await this.storage.get(Tables.UserDetails, null);
            if (userDetails) {
                return {
                    Name: userDetails.Name,
                    Surname: userDetails.Surname,
                    IDNumber: userDetails.IdNumber
                };
            } else {
                return null;
            }
        } catch (err) {
            this.logger.error('ArFormSubmitterService::checkSavedPersonalInfo', err);
        }
    }
    //#endregion ==================================================

    //#region =============== Builds the Form and It's Content ===============
    /**
     * Builds the form JSON Content
     */
    private async buildFormJsonContent(): Promise<boolean> {
        try {
            const savedInformation = await this.storage.get(Prefixes.ARFormInput, {});
            // this.increaseAndUpdateProgress(20);
            this.formContent = [];
            for (const fieldId in savedInformation) {
                if (fieldId) {
                    if (typeof (savedInformation[fieldId]) === 'object') {
                        for (const val in savedInformation[fieldId]) {
                            if (val) {
                                this.formContent.push({ FieldId: parseInt(fieldId, 0), Value: savedInformation[fieldId][val] });
                            }
                        }
                    } else {
                        this.formContent.push({ FieldId: parseInt(fieldId, 0), Value: savedInformation[fieldId] });
                    }
                }
            }
            // this.increaseAndUpdateProgress(10);
            return true;
        } catch (err) {
            this.logger.error('ArFormSubmitterService::buildFormJsonContent', err);
            return false;
        }
    }

    /**
     * Validate all the Zip Chunks that needs to be uploaded
     */
    private async extractAndValidateZipChunks(): Promise<boolean> {
        try {
            const zipChunks: ImageChunkInfo[] = await this.storage.get(Prefixes.ImageChunkInfo, []);
            const zipChunkPaths = [];
            for (const chunk of zipChunks) {
                if (zipChunkPaths.indexOf(chunk.ZipPath) < 0) {
                    zipChunkPaths.push(chunk.ZipPath);
                }
            }
            // this.increaseAndUpdateProgress(10);

            let totalSize = 0;
            let loopCounter = 0;
            const updateLoopProgress = () => {
                const loopPercentage = loopCounter / zipChunkPaths.length;
                const toUpdate = (50 * loopPercentage) + 50;
                this.currentPercentage = toUpdate;
                // this.setProgress();
            };
            for (const zipChunk of zipChunkPaths) {
                totalSize += await this.formBuilder.getZipChunkSize(zipChunk);
                loopCounter++;
                updateLoopProgress();
            }
            totalSize = Math.ceil(totalSize / 1000000);

            if (this.network.type !== 'wifi') {
                const result = await this.global.prompt(`<strong>We see you are not connected to Wifi!</strong><br /><br />To Submit this AR Form, it will require +- ${totalSize}MB of mobile data.<br /><br />Do you want to continue?`);
                if (!result) {
                    this.modalController.dismiss();
                    return;
                }
            }

            this.zipChunks = zipChunkPaths;
            this.currentPercentage = 100;
            // this.setProgress();
            return true;
        } catch (err) {
            this.logger.error('ArFormSubmitterService::extractAndValidateZipChunks', err);
            return false;
        }
    }
    private async saveZipChunk(zipArrayBuffer: ArrayBuffer, chunkName: string) {
        await this.file.writeFile(this.file.externalRootDirectory, chunkName, zipArrayBuffer, { replace: true });
    }
    //#endregion =============================================================

    //#region =============== Upload AR Form ===============
    private async getChunkBase64(chunk: string): Promise<string> {
        try {
            const chunkArrayBuffer = await this.formBuilder.getZipAsArrayBuffer(chunk);
            return this.arrayBufferToBase64(chunkArrayBuffer);
        } catch (err) {
            this.logger.error('ArFormSubmitterService::getChunkBase64', err);
        }
    }
    private arrayBufferToBase64(buffer: ArrayBuffer) {
        try {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        } catch (err) {
            this.logger.error('ArFormSubmitterService::arrayBufferToBase64', err);
        }
    }

    // private async uploadChunks(): Promise<{ ChunkKey: string }[]> {
    //     return new Promise((resolve) => {
    //         try {
    //             const chunksUploadWeight = 90;
    //             const singleChunkUploadWeight = chunksUploadWeight / this.zipChunks.length;

    //             let chunksUploaded = 0;

    //             const uploadProgressChanged = (progress: any) => {
    //                 // {type: 1, loaded: 4054, total: 4054}
    //                 if (progress.type === 1) {
    //                     const percentageComplete = Math.ceil((progress.loaded / progress.total) * singleChunkUploadWeight);
    //                     this.currentPercentage = (chunksUploaded * singleChunkUploadWeight) + percentageComplete;
    //                     this.setProgress();
    //                 }
    //             };

    //             const chunkKeys: { ChunkKey: string }[] = [];
    //             let chunkFileReaderTask: Promise<string>;
    //             const uploadChunk = async (chunkReaderTask: Promise<string>) => {
    //                 const chunkBase64 = await chunkReaderTask;

    //                 this.http.post('/forms/v1/chunk', {
    //                     Content: chunkBase64
    //                 }, true, uploadProgressChanged).then((chunkKey: string) => {
    //                     chunkKeys.push({ ChunkKey: chunkKey });
    //                     chunksUploaded++;
    //                     this.currentPercentage = (chunksUploaded * singleChunkUploadWeight);
    //                     this.setProgress();
    //                     if (chunkFileReaderTask) {
    //                         uploadChunk(chunkFileReaderTask);
    //                     } else {
    //                         resolve(chunkKeys);
    //                     }
    //                 }).catch((err) => {
    //                     this.logger.error('ArFormSubmitterService::uploadChunks::post', err);
    //                     resolve(null);
    //                 });
    //                 this.zipChunks.splice(0, 1);
    //                 if (this.zipChunks.length > 0) {
    //                     chunkFileReaderTask = this.getChunkBase64(this.zipChunks[0]);
    //                 } else {
    //                     chunkFileReaderTask = null;
    //                 }
    //             };

    //             chunkFileReaderTask = this.getChunkBase64(this.zipChunks[0]);
    //             uploadChunk(chunkFileReaderTask);
    //         } catch (err) {
    //             this.logger.error('ArFormSubmitterService::uploadChunks', err);
    //             resolve(null);
    //         }
    //     });
    }

//     private async uploadFormData(chunkKeys: { ChunkKey: string }[]): Promise<IFormValidationResult> {
//         return new Promise(async (resolve) => {
//             const savedInfo = await this.storage.getBulkARFormInputs([31, 30, 27, -1]);

//             const fullName = savedInfo[31];
//             const surname = savedInfo[30];
//             const idNumber = savedInfo[27];
//             const email = savedInfo[-1];

//             const currentLocation: Geoposition = await this.global.getLocation();
//             const getVersion = async () => {
//                 try {
//                     return await this.appVersion.getVersionNumber();
//                 } catch (err) {
//                     this.logger.error('ArFormSubmitterService::uploadFormData::getVersion', err);
//                     if (isDevMode()) {
//                         return '1.2.5';
//                     } else {
//                         throw err;
//                     }
//                 }
//             };
//             const appVersion: string = await getVersion();
//             const deviceUsed = this.device.platform;
//             const deviceModel = `${this.device.manufacturer} - ${this.device.model} (${this.device.version})`;

//             const pushId = await this.storage.get(Tables.PushNotificationId, '');

//             this.http.post('/forms/v1/arform', {
//                 UserName: fullName,
//                 UserSurname: surname,
//                 UserIDNumber: idNumber,
//                 UserEmail: email,
//                 UserPushId: pushId,
//                 MetaData: {
//                     AppVersion: appVersion,
//                     DeviceModel: deviceModel,
//                     DeviceUsed: deviceUsed,
//                     Lat: currentLocation ? currentLocation.coords.latitude : 0,
//                     Lon: currentLocation ? currentLocation.coords.longitude : 0,
//                     SubmittedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
//                 },
//                 FormContent: this.formContent,
//                 Chunks: chunkKeys
//             }, false).then(async (validationResult: IFormValidationResult) => {
//                 console.log(validationResult);
//                 resolve(validationResult);
//             }).catch(err => {
//                 this.logger.error('ArFormSubmitterService::uploadFormData', err);
//                 console.log(err);
//                 resolve(null);
//             });
//         });
//     }
//     //#endregion ===========================================

//     private increaseAndUpdateProgress(increaseAmount: number) {
//         this.currentPercentage += increaseAmount;
//         this.setProgress();
//     }
    // private setProgress() {
    //     const deductAmount = this.circleCircumfrence * (this.currentPercentage / 100);
    //     this.circleElement.style.strokeDashoffset = `${this.circleCircumfrence - deductAmount}`;
    //     this.progressEvent.emit({
    //         Percentage: this.currentPercentage,
    //         Stage: this.currentStage
    //     });
    // }

export interface ProgressEvent {
    Stage: string;
    Percentage: number;
}

interface FormInput {
    FieldId: number;
    Value: string;
}

interface IFormValidationResult {
    FormId: string;
    User: IUserModel;
}
