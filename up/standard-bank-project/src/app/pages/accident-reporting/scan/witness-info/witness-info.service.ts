import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { StorageService } from '../../../../services/storage.service';
import { GlobalService } from '../../../../services/global.service';
import { MessageBusService } from '../../../../services/messagebus.service';
import { ScannerService } from '../../../../services/scanner.service';
import { ValidateCellNumber } from '../../../../services/formvalidators.service';
import { LoggerService } from '../../../../services/logger.service';

import { Subscription } from 'rxjs';

import { GenericPopupPage } from 'src/app/generic-popup/generic-popup.page';
import { WitnessInfo } from 'src/app/pages/tabs/Model/claim.model';
import { ClaimService } from 'src/app/services/claim.service';

@Injectable()
export class WitnessInfoService {

    private formInputIdBindings = {
        WitnessType: 230,
        Surname: 231,
        HomeAddress: 232,
        PostCode: 233,
        CellNumber: 234
    };
    private formSubscription: Subscription;

    constructor(private storage: StorageService,
                private nav: NavController,
                private global: GlobalService,
                private messageBus: MessageBusService,
                private scanner: ScannerService,
                private logger: LoggerService,
                private claimService:ClaimService) {}

    buildForm(showScanner: boolean): FormGroup {
        const form = new FormGroup({
            WitnessType: new FormControl(null, { updateOn: 'blur', validators: Validators.required }),
            Surname: new FormControl('', { updateOn: 'blur', validators: Validators.required }),
            HomeAddress: new FormControl('', { updateOn: 'blur', validators: Validators.required }),
            PostCode: new FormControl('', { updateOn: 'blur', validators: Validators.required }),
            CellNumber: new FormControl('', { updateOn: 'blur', validators: [Validators.required, ValidateCellNumber] })
        });
        this.formSubscription = form.valueChanges.subscribe(x => {
            this.saveForm(x);
        });
        if (showScanner) {
            this.scanSmartId(form);
        }
        (async (formToPopulate: FormGroup) => {
            await this.populateForm(formToPopulate);
        })(form);
        return form;
    }

    async finish(popOnly: boolean) {
        if (popOnly) {
            await this.nav.pop();
            return;
        }

        const doneModal = await this.global.modal(GenericPopupPage, {
            header: 'you are Done!',
            description: [
                'Almost done please finalise the form<br> and head to Submit',
            ],
            title: ' Witness Info',
            image: 'assets/lottie/section-done_84c64ab1.gif'
        }, 'small-popup');
        const result = await doneModal.onDidDismiss();
        if (result.data) {
            await this.nav.pop();
        }
    }

    async SaveWitnessInfo(witnessInfo:WitnessInfo)
    {
        var token= await this.storage.get('WbAuth')
        var claim_id= await this.storage.get('ClaimAuth')
    
        if(token!='' && claim_id!='')
        {
        witnessInfo.claim_id=claim_id;
        let response= this.claimService.AddWitnessInfo(token,witnessInfo);
        response.subscribe(result=>{
          console.log(result);
        })
        }
        
      }

      async GetWitnessPersonalInfo()
      {
          var token= await this.storage.get('WbAuth')
          var claim_id= await this.storage.get('ClaimAuth')
      
          if(token!='' && claim_id!='')
          {
          let response= this.claimService.GetWitnessInfo(token,claim_id);
          return response;
          }
          
        }

    broadcastState(completionState: number) {
        this.formSubscription.unsubscribe();
        this.messageBus.sendMessageToHomePageMessageBus({
            State: completionState,
            TargetButton: 'WitnessInfo',
            GoToNext: ''
        });
    }

    private async scanSmartId(form: FormGroup) {
        try {
            const scanResult = await this.scanner.scanSmartId();
            console.log(scanResult,'scan result 119');
            // if (scanResult.Success) {
            //     form.get('Surname').setValue(`${scanResult.Data.Surname} ${scanResult.Data.Initials}`);
            // } else if (scanResult.Error) {
            //     await this.global.toast(scanResult.Error);
            // }
        } catch (err) {
            this.logger.error('WitnessInfoService::scanSmartId', err);
        }
    }

    private async populateForm(form: FormGroup) {
        try {
            const keysToRetrieve = [];
            for (const formItem in form.controls) {
                if (this.formInputIdBindings[formItem]) {
                    keysToRetrieve.push(this.formInputIdBindings[formItem]);
                }
            }
            // const savedInfo = await this.storage.getBulkARFormInputs(keysToRetrieve);
            // for (const formItem in form.controls) {
            //     if (this.formInputIdBindings[formItem]) {
            //         if (savedInfo[this.formInputIdBindings[formItem]]) {
            //             form.get(formItem).setValue(savedInfo[this.formInputIdBindings[formItem]]);
            //         }
            //     }
            // }
        } catch (err) {
            this.logger.error('WitnessInfoService::populateForm', err);
        }
    }

    private async saveForm(values: any) {
        try {
            const infoToSave = {};
            for (const key in values) {
                if (this.formInputIdBindings[key]) {
                    infoToSave[this.formInputIdBindings[key]] = values[key];
                }
            }
            await this.storage.insertBulkARFormInputs(infoToSave);
        } catch (err) {
            this.logger.error('WitnessInfoService::saveForm', err);
        }
    }
}
