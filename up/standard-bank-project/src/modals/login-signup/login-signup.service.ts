import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ModalController } from '@ionic/angular';

import { GlobalService } from '../../services/global.service';
import { HttpService } from '../../services/http.service';
import { StorageService, Tables, Prefixes } from '../../services/storage.service';
import { MessageBusService } from '../../services/messagebus.service';
import { PageBuilderService } from '../../services/pagebuilder.service';
import { IUserModel, IArFormHistory, IArFormHistoryDetails } from '../../services/models.service';
import { LoggerService } from '../../services/logger.service';

@Injectable()
export class LoginSignupService {

    private loginForm: FormGroup;
    private signUpForm: FormGroup;

    constructor(private global: GlobalService,
                private modalController: ModalController,
                private http: HttpService,
                private storage: StorageService,
                private messageBus: MessageBusService,
                private pageBuilder: PageBuilderService,
                private logger: LoggerService) {}

    initialize() {
        this.loginForm = new FormGroup({
            Email: new FormControl('', { updateOn: 'blur', validators: [Validators.required, Validators.email] } ),
            IDNumber: new FormControl('', { updateOn: 'blur', validators: Validators.required })
        });
        this.signUpForm = new FormGroup({
            Name: new FormControl('', { updateOn: 'blur', validators: Validators.required }),
            Surname: new FormControl('', { updateOn: 'blur', validators: Validators.required })
        });
        return {
            LoginForm: this.loginForm,
            SignupForm: this.signUpForm
        };
    }

    async closeForm() {
        await this.modalController.dismiss();
    }

    async login() {
        if (this.loginForm.valid) {
            const loading = await this.global.loading('Authenticating...');
            try {
                const userModel: IUserModel = (await this.http.post('/users/v1/authenticate', {
                    Email: this.loginForm.get('Email').value,
                    Password: this.loginForm.get('IDNumber').value
                })) as IUserModel;

                await this.storage.set(Tables.UserDetails, userModel);
                this.messageBus.sendMessageToUserLoginChangeMessageBus();

                loading.message = 'Retrieving Submission History...';
                await loading.present();

                await this.getUserHistory(userModel.Id);

                await this.global.toast(`Welcome back ${userModel.Name} :)`);
                this.logger.info('login', userModel);
                this.modalController.dismiss();
            } catch (err) {
                this.logger.error('LoginSignupService::login', err);
                await this.global.toast('Invalid Email and/or ID Number.');
            } finally {
                await loading.dismiss();
            }
        } else {
            await this.global.toast('Please enter valid values in all the provided fields');
        }
    }

    async getUserHistory(userId: string) {
        try {
            const formHistory: IFormHistory[] = (await this.http.get(`/forms/v1/history/${userId}`)) as IFormHistory[];
            const accidentTypes = this.pageBuilder.accidentTypeOptions();

            const formHistoriesToStore: IArFormHistory[] = [];

            for (const form of formHistory) {
                let accidentType = null;
                if (form.FormOverView.AccidentType) {
                    const accidentTypeOption = accidentTypes.find(x => x.ID === parseInt(form.FormOverView.AccidentType, 0));
                    if (accidentTypeOption) {
                        accidentType = accidentTypeOption.Description;
                    }
                }
                formHistoriesToStore.push({
                    AccidentDate: form.FormOverView.AccidentDate,
                    AccidentType: accidentType ? accidentType : 'Unknown',
                    FormId: form.FormOverView.FormId,
                    LocationOfAccident: form.FormOverView.LocationOfAccident ? form.FormOverView.LocationOfAccident : 'Unknown',
                    OtherDriverFullName: form.FormOverView.OtherDriverFullName ? form.FormOverView.OtherDriverFullName : 'Unknown'
                });

                const formDetailsToSave: IArFormHistoryDetails = {
                    FormId: form.FormDetails.FormId,
                    ArFormDownloadLink: form.FormDetails.ArFormDownloadLink,
                    SnapsDownloadLink: form.FormDetails.SnapsDownloadLink
                };
                await this.storage.set(`${Prefixes.ArFormHistoryDetail}${form.FormDetails.FormId}`, formDetailsToSave);
            }

            await this.storage.set(Tables.ARFormHistory, formHistoriesToStore);
        } catch (err) {
            this.logger.error('LoginSignupService::getUserHistory', err);
        }
    }

    async signUp() {
        if (this.loginForm.valid && this.signUpForm.valid) {
            const loading = await this.global.loading('Creating User...');

            const pushID = await this.storage.get(Tables.PushNotificationId, '');
            try {
                const createResult: IUserModel = (await this.http.post('/users/v1', {
                    Email: this.loginForm.get('Email').value,
                    Name: this.signUpForm.get('Name').value,
                    Surname: this.signUpForm.get('Surname').value,
                    IdNumber: this.loginForm.get('IDNumber').value,
                    PushId: pushID
                })) as IUserModel;

                await this.storage.set(Tables.UserDetails, createResult);
                this.messageBus.sendMessageToUserLoginChangeMessageBus();
                await this.global.toast(`Welcome ${createResult.Name} :)`);
                this.logger.info('sign_up', createResult);
                this.modalController.dismiss();
            } catch (err) {
                this.logger.error('LoginSignupService::signUp', err);
            } finally {
                await loading.dismiss();
            }
        } else {
            await this.global.toast('Please enter valid values in all the provided fields');
        }
    }
}

interface IFormHistory {
    FormOverView: IArFormOverview;
    FormDetails: IArFormDetails;
}

interface IArFormOverview {
    AccidentType: string;
    AccidentDate: string;
    OtherDriverFullName: string;
    LocationOfAccident: string;
    FormId: string;
}

interface IArFormDetails {
    FormId: string;
    ArFormDownloadLink: string;
    SnapsDownloadLink: string;
}
