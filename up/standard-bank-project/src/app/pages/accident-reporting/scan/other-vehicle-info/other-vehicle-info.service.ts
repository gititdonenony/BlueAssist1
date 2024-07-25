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
import { CameraService } from '../../../../camera.service'

import { GenericPopupPage } from 'src/modals/generic-popup/generic-popup.page';
import { ClaimService } from 'src/app/services/claim.service';
import { OtherDriveVehicleInfo } from 'src/app/pages/tabs/Model/claim.model';

@Injectable()
export class OtherVehicleInfoService {
    private formInputKeyMapping = {
        NumberPlateNumber: 85,
        LicenceDiskNumber: 86,
        Color: 87,
        Make: 88,
        Model: 89,
        TyresBurst: 264,
        Chevron: 268
    };

    private vehicleInfoSubscription: Subscription;
    userprofile: any;

    constructor(private storage: StorageService,
                private global: GlobalService,
                private scanner: ScannerService,
                private pageBuilder: PageBuilderService,
                private nav: NavController,
                private camera: CameraService,
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
                'if you have <strong>completed scan  other <br> drivers vehicla info </strong> you can <strong>scan<br> your Smart ID</strong>',
            ],
            title: 'You are done with scanning <br> <strong>other Drivers Vehicle Disk Info</strong>',
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
            TargetButton: 'OtherVehicleInfo',
            GoToNext: shouldContinue ? 'YourInfo' : ''
        });
    }

    async getRadioOptions(otherDriveVehicleInfo:OtherDriveVehicleInfo) {
        const radioOptions = {
            TyresBurstOptions: await this.getGenericOptions(this.pageBuilder.noYesUnknownOptions(), Number(otherDriveVehicleInfo.tyres_burst)),
            ChevronOptions: await this.getGenericOptions(this.pageBuilder.goodFaultyUnknownOptions(),Number( otherDriveVehicleInfo.quality_chevron))
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
        if (this.formInputKeyMapping[optionName]) {
            await this.storage.setARFormInput(this.formInputKeyMapping[optionName], value);
        }
    }

    private async getGenericOptions(options: IIconRadioOption[], key: number) {
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
    }

    // private async scanLicenseDisk(form: FormGroup) {
    
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
    //         this.logger.error('OtherVehicleInfoService::scanLicenseDisk', err);
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
            this.logger.error('OtherVehicleInfoService::populateInfo', err);
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
            this.logger.error('OtherVehicleInfoService::saveInfo', err);
        }
    }

    async SaveOtherDriveVehicleInfo(otherDriveVehicleInfo:OtherDriveVehicleInfo)
    {
        var token= await this.storage.get('WbAuth')
        var claim_id= await this.storage.get('ClaimAuth')
    
        if(token!='' && claim_id!='')
        {
          otherDriveVehicleInfo.claim_id=claim_id;
          let response= this.claimService.AddOtherDriveVehicleInfo(token,otherDriveVehicleInfo);
          response.subscribe(result=>{
          console.log(result);
          })
        }
        
      }

      async GetOtherDriveVehicleInfo()
      {
          var token= await this.storage.get('WbAuth')
          var claim_id= await this.storage.get('ClaimAuth')
      
          if(token!='' && claim_id!='')
          {
          let response= this.claimService.getOtherDriveVehicleInfo(token,claim_id);
          return response;
          }
          
        }

      
}

