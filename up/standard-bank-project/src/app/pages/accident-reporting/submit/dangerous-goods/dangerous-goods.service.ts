import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

import { PageBuilderService } from '../../../../services/pagebuilder.service';
import { StorageService } from '../../../../services/storage.service';
import { IIconRadioOption } from '../../../../services/models.service';
import { GlobalService } from '../../../../services/global.service';
import { MessageBusService } from '../../../../services/messagebus.service';
import { LoggerService } from '../../../../services/logger.service';

import { GenericPopupPage } from "src/app/generic-popup/generic-popup.page";
import { DangerousGoods } from "src/app/pages/tabs/Model/claim.model";
import { ClaimService } from "src/app/services/claim.service";

@Injectable()
export class DangerousGoodsService {

    private fieldIdMapping = {
        GoodsCarried: 247,
        Spillage: 248,
        GasEmission: 249,
        Placard: 250
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
            this.savedInfo = await this.storage.getBulkARFormInputs(
                [
                    this.fieldIdMapping.GoodsCarried,
                    this.fieldIdMapping.Spillage,
                    this.fieldIdMapping.GasEmission,
                    this.fieldIdMapping.Placard
                ]);
            const radioOptions = {
                GoodsCarriedOptions: await this.loadRadioOptions(this.pageBuilder.yesNoUnknownOptions(), this.fieldIdMapping.GoodsCarried),
                SpillageOptions: await this.loadRadioOptions(this.pageBuilder.yesNoUnknownOptions(), this.fieldIdMapping.Spillage),
                GasEmissionOptions: await this.loadRadioOptions(this.pageBuilder.yesNoUnknownOptions(), this.fieldIdMapping.GasEmission),
                PlacardOptions: await this.loadRadioOptions(this.pageBuilder.yesNoUnknownOptions(), this.fieldIdMapping.Placard)
            };

            return radioOptions;
        } catch (err) {
            this.logger.error('DangerousGoodsService::initialize', err);
        }
    }

    async saveRadioSelection(eventName: string, selectedId: number) {
        try {
            if (this.fieldIdMapping[eventName]) {
                await this.storage.setARFormInput(this.fieldIdMapping[eventName], selectedId);
            }
        } catch (err) {
            this.logger.error('DangerousGoodsService::saveRadioSelection', err);
        }
    }

    async finish(popOnly: boolean) {
        if (popOnly) {
            await this.nav.pop();
            return;
        }

        const doneModal = await this.global.modal(GenericPopupPage, {
            header: 'Yor are Done!',
            description: [
                'Please print and submit your<br> accident form',
            ],
            title: ' Dangerous Goods',
            image: 'assets/lottie/section-done_84c64ab1.gif'
        }, 'small-popup');
        const result = await doneModal.onDidDismiss();
        if (result.data) {
            await this.nav.pop();
        }
    }

    broadcastState(completionState: number) {
        this.messageBus.sendMessageToHomePageMessageBus({
            State: completionState,
            TargetButton: 'DangerousGoods'
        });
    }

    async SaveDangerousGoods(dangerousGoods:DangerousGoods)
    {
        var token= await this.storage.get('WbAuth')
        var claim_id= await this.storage.get('ClaimAuth')
    
        if(token!='' && claim_id!='')
        {
        dangerousGoods.claim_id=claim_id;
        let response= this.claimService.AddDangerousGoods(token,dangerousGoods);
        response.subscribe(result=>{
          console.log(result);
        })
        }
        
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
            this.logger.error('DangerousGoodsService::loadRadioOptions', err);
        }
    }
}
