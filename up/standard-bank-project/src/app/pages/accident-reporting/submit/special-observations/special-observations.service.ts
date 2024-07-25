import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

import { PageBuilderService } from '../../../../services/pagebuilder.service';
import { StorageService } from '../../../../services/storage.service';
import { IIconRadioOption } from '../../../../services/models.service';
import { GlobalService } from '../../../../services/global.service';
import { MessageBusService } from '../../../../services/messagebus.service';
import { LoggerService } from '../../../../services/logger.service';

import { GenericPopupPage } from 'src/app/generic-popup/generic-popup.page';
import { SpecialObservations } from 'src/app/pages/tabs/Model/claim.model';
import { ClaimService } from 'src/app/services/claim.service';

@Injectable()
export class SpecialObservationsService {

    private fieldIdMapping = {
        Trapped: 260,
        UseOfCellphone: 261
    };
    private savedInfo: any = {};

    constructor(private pageBuilder: PageBuilderService,
                private storage: StorageService,
                private nav: NavController,
                private global: GlobalService,
                private messageBus: MessageBusService,
                private logger: LoggerService,
                private claimService:ClaimService) {}

    async initialize() {
        try {
            this.savedInfo = await this.storage.getBulkARFormInputs([this.fieldIdMapping.Trapped, this.fieldIdMapping.UseOfCellphone]);
            const radioOptions = {
                TrappedOptions: await this.loadRadioOptions(this.pageBuilder.trappedOfFallenOutOptions(), this.fieldIdMapping.Trapped),
                UseOfCellphone: await this.loadRadioOptions(this.pageBuilder.yesNoUnknownOptions(), this.fieldIdMapping.UseOfCellphone)
            };

            return radioOptions;
        } catch (err) {
            this.logger.error('SpecialObservationsService::initialize', err);
        }
    }

    async saveRadioSelection(eventName: string, selectedId: number) {
        try {
            if (this.fieldIdMapping[eventName]) {
                await this.storage.setARFormInput(this.fieldIdMapping[eventName], selectedId);
            }
        } catch (err) {
            this.logger.error('SpecialObservationsService::saveRadioSelection', err);
        }
    }

    async finish(popOnly: boolean) {
        if (popOnly) {
            await this.nav.pop();
            return;
        }

        const doneModal = await this.global.modal(GenericPopupPage, {
            header: 'You are Done!',
            description: [
                'Please complete dangerous goods if applicable',
            ],
            title: ' Special Observations',
            image: 'assets/lottie/section-done_84c64ab1.gif'
        }, 'small-popup');
        const result = await doneModal.onDidDismiss();
        if (result.data) {
            await this.nav.pop();
        }
    }

    async SaveSpecialObservations(specialObservations:SpecialObservations)
    {
        var token= await this.storage.get('WbAuth')
        var claim_id= await this.storage.get('ClaimAuth')
    
        if(token!='' && claim_id!='')
        {
        specialObservations.claim_id=claim_id;
        let response= this.claimService.AddSpecialObservations(token,specialObservations);
        response.subscribe(result=>{
          console.log(result);
        })
        }
        
      }

    broadcastState(completionState: number) {
        this.messageBus.sendMessageToHomePageMessageBus({
            State: completionState,
            TargetButton: 'SpecialObservations'
        });
    }

    private async loadRadioOptions(options: IIconRadioOption[], key: number) {
        try {
            if (this.savedInfo[key]) {
                const optionToEdit = options.find(x => x.ID === this.savedInfo[key]);
                if (optionToEdit) {
                    optionToEdit.Selected = true;
                }
            }
            return options;
        } catch (err) {
            this.logger.error('SpecialObservationsService::loadRadioOptions', err);
        }
    }
}
