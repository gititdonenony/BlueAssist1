import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

import { StorageService, Prefixes } from '../../../../services/storage.service';
import { GlobalService } from '../../../../services/global.service';
import { PageBuilderService } from '../../../../services/pagebuilder.service';
import { IIconRadioOption, ICameraCaptureInfo } from '../../../../services/models.service';
import { MessageBusService } from '../../../../services/messagebus.service';
import { LoggerService } from '../../../../services/logger.service';

import { GenericPopupPage } from 'src/app/generic-popup/generic-popup.page'

import { trigger, style, state, animate, transition, keyframes } from '@angular/animations';
import { ClaimService } from 'src/app/services/claim.service';
import { RoadConditionModal } from 'src/app/pages/tabs/Model/claim.model';
export const PageAnimations = [
    trigger('evidence', [
        state('hidden', style({ transform: 'translateY(110%)' })),
        state('visible', style({ transform: 'translateY(0)' })),
        state('backdropHidden', style({ transform: 'translateY(110%)' })),
        state('backdropVisible', style({ transform: 'translateY(0)' })),
        transition('hidden <=> visible', [
            animate(200)
        ]),
        transition('backdropHidden <=> backdropVisible', [
            animate(0)
        ])
    ]),
    trigger('zoom', [
        state('open', style({ transform: 'scale(1)' })),
        state('closed', style({ transform: 'scale(0)' })),
        transition('open <=> closed', [
            animate(250)
        ])
    ])
];

@Injectable()
export class RoadConditionsService {

    private sliderOptions: any = {};
    private savedInformation: any = {};
    pageDataKeyMapping = {
        roadSurfaceTypeOptions: 108,
        roadTypeOptions: 22,
        roadSurfaceConditionOptions: 110,
        roadQualityOptions: 109,
        directionOfRoadOptions: 97,
        juntionTypeOptions: 23,
        trafficControlTypeOptions: 94,
        roadMarkingVisibilityOptions: 111,
        roadSignsVisibleOptions: 95,
        roadSignConditionOptions: 96,
        overtakingControlOptions: 113,
        obstructionOptions: 112,
        lightConditionOptions: 106,
        weatherConditionOptions: 107
    };

    constructor(private global: GlobalService,
                private pageBuilder: PageBuilderService,
                private storage: StorageService,
                private nav: NavController,
                private messageBus: MessageBusService,
                private logger: LoggerService,
                private claimService:ClaimService) { }

    async initialize(initialPage: string) {
        try {
            this.sliderOptions['roadSurfaceTypeOptions'] = this.pageBuilder.roadSurfaceTypeOptions();
            this.sliderOptions['roadTypeOptions'] = this.pageBuilder.roadTypeOptions();
            this.sliderOptions['roadSurfaceConditionOptions'] = this.pageBuilder.roadSurfaceConditionOptions();
            this.sliderOptions['roadQualityOptions'] = this.pageBuilder.roadQualityOptions();
            this.sliderOptions['directionOfRoadOptions'] = this.pageBuilder.directionOfRoadOptions();
            this.sliderOptions['juntionTypeOptions'] = this.pageBuilder.juntionTypeOptions();
            this.sliderOptions['trafficControlTypeOptions'] = this.pageBuilder.trafficControlTypeOptions();
            this.sliderOptions['roadMarkingVisibilityOptions'] = this.pageBuilder.roadMarkingVisibilityOptions();
            this.sliderOptions['roadSignsVisibleOptions'] = this.pageBuilder.yesNoNotApplicableOptions();
            this.sliderOptions['roadSignConditionOptions'] = this.pageBuilder.roadSignConditionOptions();
            this.sliderOptions['overtakingControlOptions'] = this.pageBuilder.overtakingControlOptions();
            this.sliderOptions['obstructionOptions'] = this.pageBuilder.obstructionOptions();
            this.sliderOptions['lightConditionOptions'] = this.pageBuilder.lightConditionOptions();
            this.sliderOptions['weatherConditionOptions'] = this.pageBuilder.weatherConditionOptions();

            this.savedInformation = await this.storage.getBulkARFormInputs([108, 22, 110, 109, 97, 23, 94, 111, 95, 96, 113, 112, 106, 107]);
            console.log(this.savedInformation)
            // return this.getSliderOptions(initialPage);
        } catch (err) {
            this.logger.error('RoadConditionsService::initialize', err);
        }
    }

    isIOS() {
        return this.global.isIOS();
    }


    getSliderOptionsSlide(page: string) {
        // const pageKey = this.pageDataKeyMapping[page];
        // if (this.savedInformation[pageKey]) {
        //     const optionToSet: IIconRadioOption = this.sliderOptions[page].find(x => {
        //         return x.ID === this.savedInformation[pageKey];
        //     });
        //     if (optionToSet) {
        //         optionToSet.Selected = true;
        //     }
        // }

        return this.sliderOptions[page];
    }

    getSliderOptions(page: string, selectedValue:number) {
        const pageKey = this.pageDataKeyMapping[page];

        // if (this.savedInformation[pageKey]) {
        //     const optionToSet: IIconRadioOption = this.sliderOptions[page].find(x => {
        //         return x.ID === this.savedInformation[pageKey],console.log(this.savedInformation[pageKey]);
        //     });
        //     if (optionToSet) {
        //         optionToSet.Selected = true;
        //     }
        // }
         if (selectedValue) {
            const optionToSet: IIconRadioOption = this.sliderOptions[page].find(x => {
                return x.ID === selectedValue;
            });
            if (optionToSet) {
                optionToSet.Selected = true;
            }
        }

        return this.sliderOptions[page];
    }


    getSliderIndexPageMapping(index: number) {
        switch (index) {
            case 0:
                return 'roadSurfaceTypeOptions';
            case 1:
                return 'roadTypeOptions';
            case 2:
                return 'roadSurfaceConditionOptions';
            case 3:
                return 'roadQualityOptions';
            case 4:
                return 'directionOfRoadOptions';
            case 5:
                return 'juntionTypeOptions';
            case 6:
                return 'trafficControlTypeOptions';
            case 7:
                return 'roadMarkingVisibilityOptions';
            case 8:
                return 'roadSignsVisibleOptions';
            case 9:
                return 'roadSignConditionOptions';
            case 10:
                return 'overtakingControlOptions';
            case 11:
                return 'obstructionOptions';
            case 12:
                return 'lightConditionOptions';
            case 13:
                return 'weatherConditionOptions';
            default:
                return '';
        }
    }

    async saveSelection(key: number, selectedId: number) {
        try {
            await this.storage.setARFormInput(key, selectedId);
        } catch (err) {
            this.logger.error('RoadConditionsService::saveSelection', err);
        }
    }

    async getEvidence(evidenceType: string) {
        try {
            const storedEvidence = await this.storage.getInstance<ICameraCaptureInfo>(`${Prefixes.Evidence}${evidenceType}`);
            if (storedEvidence && storedEvidence.FullPath) {
                return await this.global.retrievePhoto(storedEvidence);
            } else {
                return '';
            }
        } catch (err) {
            this.logger.error('RoadConditionsService::uploadEvidence', err);
        }
    }

    async deleteEvidence(evidenceType: string) {
        try {
            const storedEvidence = await this.storage.getInstance<ICameraCaptureInfo>(`${Prefixes.Evidence}${evidenceType}`);
            if (storedEvidence && storedEvidence.FullPath) {
                return await this.global.deletePhoto(storedEvidence);
            }
        } catch (err) {
            this.logger.error('RoadConditionsService::deleteEvidence', err);
        }
    }

    async captureImage(key: string) {
        try {
            return await this.global.capturePhoto(`${Prefixes.Evidence}${key}`);
        } catch (err) {
            this.logger.error('RoadConditionsService::captureImage', err);
        }
    }
    async saveCapturedImage(key: string, image: ICameraCaptureInfo) {
        try {
            await this.storage.saveImageCaptureInfo(`${Prefixes.Evidence}${key}`, image);
        } catch (err) {
            this.logger.error('RoadConditionsService::saveCapturedImage', err);
        }
    }

    async finish(onlyPop: boolean) {
        if (onlyPop) {
            await this.nav.pop();
            return;
        }

        const doneModal = await this.global.modal(GenericPopupPage, {
            header: 'You are Done!',
            description: [
                'If you have <strong>completed Snap</strong> you can<br> <strong>move your car </strong>out of the road <br> and <strong>continue to Scan</strong>',
            ],
            title: 'You are done with snapping <br><strong> Road Conditions</strong>',
            image: 'assets/lottie/section-done_84c64ab1.gif'
        }, 'small-popup');
        const result = await doneModal.onDidDismiss();
        if (result.data) {
            await this.nav.pop();
            return true;
        }
        return false;
    }

    broadcastState(completionState: number, shouldContinue: boolean) {
        this.messageBus.sendMessageToHomePageMessageBus({
            State: completionState,
            TargetButton: 'RoadConditions',
            GoToNext: shouldContinue ? '' : ''
        });
    }

    async SaveAccidentDamage(roadConditionModal:RoadConditionModal)
    {
      var token= await this.storage.get('WbAuth')
      var claim_id= await this.storage.get('ClaimAuth')
  
      if(token!='' && claim_id!='')
      {
        roadConditionModal.claim_id=claim_id;
        let response= this.claimService.SaveRoadCondition(token,roadConditionModal);
        response.subscribe(result=>{
        console.log(result);
      })
      }
      
    }

    async ServerSaveImage(imgData:ICameraCaptureInfo)
    {
        var formData=this.global.readFile(imgData);
        var token= await this.storage.get('WbAuth')
        var response= this.claimService.uploadImage(token,formData)
        return response
    }

    async getRoadCondition()
  {
      var token= await this.storage.get('WbAuth')
      var claim_id= await this.storage.get('ClaimAuth')
  
      if(token!='' && claim_id!='')
      {
      let response= this.claimService.getRoadCondition(token,claim_id);
      return response;
      }
      
    }
}
