import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { Subscription } from 'rxjs';

import { StorageService } from '../../../../services/storage.service';
import { GlobalService } from '../../../../services/global.service';
import { ScannerService } from '../../../../services/scanner.service';
import { PageBuilderService } from '../../../../services/pagebuilder.service';
import { MessageBusService } from '../../../../services/messagebus.service';
import { IIconRadioOption } from '../../../../services/models.service';
import { LoggerService } from '../../../../services/logger.service';

import { GenericPopupPage } from 'src/app/generic-popup/generic-popup.page';
import { YourVehicleInfo } from 'src/app/pages/tabs/Model/claim.model';
import { ClaimService } from 'src/app/services/claim.service';
import { CameraService } from '../../../../camera.service'

@Injectable()
export class YourVehicleInfoService {
    private formInputKeyMapping = {
        NumberPlateNumber: 77,
        LicenceDiskNumber: 78,
        Color: 79,
        Make: 80,
        Model: 81,
        TyresBurst: 252,
        Chevron: 256
    };

    private vehicleInfoSubscription: Subscription;
    userprofile: any;

    constructor(private storage: StorageService,
                private global: GlobalService,
                private scanner: ScannerService,
                private camera:CameraService,
                private pageBuilder: PageBuilderService,
                private nav: NavController,
                private messageBus: MessageBusService,
                private logger: LoggerService,
                private claimService:ClaimService) { }

    initialize(showScanner: boolean) {
        const form = this.buildVehicleInfoForm();
        // if (showScanner) {
        //     this.scanLicenseDisk(form);
        // }
        return form;
    }

    async finish(popOnly: boolean) {
        if (popOnly) {
            await this.nav.pop();
            return;
        }

        const doneModal = await this.global.modal(GenericPopupPage, {
            header: 'You are Done!',
            description: [
                ' If you have<strong> completed Scanning <br>your Vehicle Disk Info </strong>you can continue',
            ],
            title: 'You are done scanning<br> your <strong>Vehicle Disk Info</strong>',
            image: 'assets/lottie/section-done_84c64ab1.gif'
        }, 'small-popup');
        const result = await doneModal.onDidDismiss();
        if (result.data) {
            await this.nav.pop();
        }
    }

    broadcastState(completionState: number, shouldContinue: boolean) {
        this.vehicleInfoSubscription.unsubscribe();
        this.messageBus.sendMessageToHomePageMessageBus({
            State: completionState,
            TargetButton: 'YourVehicleInfo',
            GoToNext: shouldContinue ? 'PassengerInfo' : ''
        });
    }

    async getRadioOptions(yourVehicleInfo:YourVehicleInfo) {
        const radioOptions = {
            TyresBurstOptions: await this.getGenericOptions(this.pageBuilder.noYesUnknownOptions(), Number(yourVehicleInfo.tyres_burst)),
            ChevronOptions: await this.getGenericOptions(this.pageBuilder.goodFaultyUnknownOptions(),Number(yourVehicleInfo.quality_chevron))
        };
        return radioOptions;
    }

    buildVehicleInfoForm(): FormGroup {
        const formGroup = new FormGroup({
            NumberPlateNumber: new FormControl('', { updateOn: 'blur', validators: Validators.required }),
            LicenceDiskNumber: new FormControl('', { updateOn: 'blur', validators: Validators.required }),
            Color: new FormControl('', { updateOn: 'blur', validators: Validators.required }),
            Make: new FormControl('', { updateOn: 'blur', validators: Validators.required }),
            Model: new FormControl('', { updateOn: 'blur', validators: Validators.required })
        });
        this.vehicleInfoSubscription = formGroup.valueChanges.subscribe((x) => { this.saveInfo(x); });
        (async (group: FormGroup) => {
            await this.populateInfo(group);
        })(formGroup);
        return formGroup;
    }

    async saveRadioOption(optionName: string, value: number) {
        try {
            if (this.formInputKeyMapping[optionName]) {
                await this.storage.setARFormInput(this.formInputKeyMapping[optionName], value);
            }
        } catch (err) {
            this.logger.error('YourVehicleInfoService::saveRadioOption', err);
        }
    }

    private async getGenericOptions(options: IIconRadioOption[], key: number) {
        try {
            // const savedOption = await this.storage.getARFormInput(key);
            // if (savedOption) {
            //     const optionToSet = options.find(x => x.ID === savedOption);
            //     if (optionToSet) {
            //         optionToSet.Selected = true;
            //     }
            // }
            const optionToSet = options.find(x => x.ID === key);
            if (optionToSet) {
                optionToSet.Selected = true;
            }
            return options;
        } catch (err) {
            this.logger.error('YourVehicleInfoService::getGenericOptions', err);
        }
    }

    // private async scanLicenseDisk(form: FormGroup) {
    //     // this.camera.openCamera().then(data => {
    //     //     this.userprofile = data;
    //     //     console.log(data)
    //     //   })
    //     try {
    //         const scanResult = await this.scanner.scanLicenseDisk();
    //         if (scanResult.Success) {
    //             form.get('NumberPlateNumber').setValue(scanResult.Data.NumberPlateNumber);
    //             form.get('LicenceDiskNumber').setValue(scanResult.Data.LicenseDiscNumber);
    //             form.get('Color').setValue(scanResult.Data.VehicleColor);
    //             form.get('Make').setValue(scanResult.Data.VehicleMake);
    //             form.get('Model').setValue(scanResult.Data.VehicleModel);
    //         } else if (scanResult.Error) {
    //             await this.global.toast(scanResult.Error);
    //         }
    //     } catch (err) {
    //         this.logger.error('YourVehicleInfoService::scanLicenseDisk', err);
    //     }
    // }

    private async populateInfo(formGroup: FormGroup) {
        try {
            const keysToRetrieve = [];
            for (const control in formGroup.controls) {
                if (!this.formInputKeyMapping[control]) {
                    continue;
                }
                keysToRetrieve.push(this.formInputKeyMapping[control]);
            }
            const savedInfo = await this.storage.getBulkARFormInputs(keysToRetrieve);
            for (const control in formGroup.controls) {
                if (!this.formInputKeyMapping[control]) {
                    continue;
                }
                if (savedInfo[this.formInputKeyMapping[control]]) {
                    formGroup.get(control).setValue(savedInfo[this.formInputKeyMapping[control]]);
                }
            }
        } catch (err) {
            this.logger.error('YourVehicleInfoService::populateInfo', err);
        }
    }

    private async saveInfo(formControls: any) {
        try {
            const infoToSave = {};
            for (const key in formControls) {
                if (!this.formInputKeyMapping[key]) {
                    continue;
                }
                infoToSave[this.formInputKeyMapping[key]] = formControls[key];
            }
            await this.storage.insertBulkARFormInputs(infoToSave);
        } catch (err) {
            this.logger.error('YourVehicleInfoService::saveInfo', err);
        }
    }

    async SaveVechicleInfo(yourVehicleInfo:YourVehicleInfo)
    {
        var token= await this.storage.get('WbAuth')
        var claim_id= await this.storage.get('ClaimAuth')
    
        if(token!='' && claim_id!='')
        {
            yourVehicleInfo.claim_id=claim_id;
          let response= this.claimService.AddYourVehicleInfo(token,yourVehicleInfo);
          response.subscribe(result=>{
          console.log(result);
          })
        }
        
      }

      async GetYourVihicleInfo()
      {
          var token= await this.storage.get('WbAuth')
          var claim_id= await this.storage.get('ClaimAuth')
      
          if(token!='' && claim_id!='')
          {
          let response= this.claimService.GetYouVehicleInfo(token,claim_id);
          return response;
          }
          
        }
}

