import { Injectable } from '@angular/core';

import { NavController } from '@ionic/angular';

import { StorageService, Prefixes } from '../../../../services/storage.service';
import { PageBuilderService } from '../../../../services/pagebuilder.service';
import { GlobalService } from '../../../../services/global.service';
import { ICameraCaptureInfo, IDamageCapture } from '../../../../services/models.service';
import { MessageBusService } from '../../../../services/messagebus.service';
import { LoggerService } from '../../../../services/logger.service';

import { GenericPopupPage } from "src/app/generic-popup/generic-popup.page";

import { trigger, style, state, animate, transition } from '@angular/animations';
import { IIconRadioOption } from 'src/app/services/models.service';
import { ClaimService } from 'src/app/services/claim.service';
import { YourVehicleDamageModel } from 'src/app/pages/tabs/Model/claim.model'
export const PageAnimations = [
    trigger('collapse', [
        state('open', style({
            height: '168px',
            paddingTop: '11px',
            paddingBottom: '11px'
        })),
        state('closed', style({
            height: '0',
            paddingTop: '0',
            paddingBottom: '0'
        })),
        transition('open <=> closed', [
            animate(200)
        ])
    ]),
    trigger('inverse', [
        state('normal', style({ transform: 'rotate(0deg)' })),
        state('inverse', style({ transform: 'rotate(180deg)' })),
        transition('normal <=> inverse', [
            animate(200)
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
export class YourVehicleDamagesService {

    private sliderOptions: any = {};
    private savedInformation: any = {};
    pageDataKeyMapping = {
        vehicleTypeOptions: 92,
        positionBeforeAccident: 100,
        whatDriverWasDoingOptions: 102,
        directionVehicleWasTravellingOptions: 76,
        conditionOfVehicleLights: 254,
        conditionOfReflectorsOptions: 255,
        flatOrSlopedRoadOptions: 98,
    };
    private vehicleDamagesId = 104;

    damageCaptures: IDamageCapture[] = [
        {
            Title: 'Front',
            Description: 'Stand in front of your vehicle, and capture the damage(s) clearly',
            Icon: 'front',
            FieldId: 10
        },
        {
            Title: 'Front Right',
            Description: 'Stand to the front right of your vehicle, and capture the damage(s) clearly',
            Icon: 'front-right',
            FieldId: 1
        },
        {
            Title: 'Front Left',
            Description: 'Stand to the front left of your vehicle, and capture the damage(s) clearly',
            Icon: 'front-left',
            FieldId: 9
        },
        {
            Title: 'Back',
            Description: 'Stand at the back of your vehicle, and capture the damage(s) clearly',
            Icon: 'back',
            FieldId: 5
        },
        {
            Title: 'Back Right',
            Description: 'Stand to the back right of your vehicle, and capture the damage(s) clearly',
            Icon: 'back-right',
            FieldId: 4
        },
        {
            Title: 'Back Left',
            Description: 'Stand to the back left of your vehicle, and capture the damage(s) clearly',
            Icon: 'back-left',
            FieldId: 6
        },
        {
            Title: 'Left Front',
            Description: 'Capture any damages to the left front of your vehicle',
            Icon: 'left-front',
            FieldId: 8
        },
        {
            Title: 'Left Back',
            Description: 'Capture any damages to the left back of your vehicle',
            Icon: 'left-back',
            FieldId: 7
        },
        {
            Title: 'Right Front',
            Description: 'Capture any damages to the right front of your vehicle',
            Icon: 'right-front',
            FieldId: 2
        },
        {
            Title: 'Right Back',
            Description: 'Capture any damages to the right back of your vehicle',
            Icon: 'right-back',
            FieldId: 3
        },
        {
            Title: 'Bonnet',
            Description: 'Capture any damages to the bonnet of your vehicle',
            Icon: 'bonnet',
            FieldId: 11
        },
        {
            Title: 'Roof',
            Description: 'Capture any damages to the roof of your vehicle',
            Icon: 'roof',
            FieldId: 12
        },
        {
            Title: 'Boot',
            Description: 'Capture any damages to the boot of your vehicle',
            Icon: 'boot',
            FieldId: 13
        },
        {
            Title: 'Multiple',
            Description: 'Capture multiple damages to 1 spot on your vehicle',
            Icon: 'multiple',
            FieldId: 14
        },
        {
            Title: 'Caught on Fire',
            Description: 'Capture evidence of your being on fire / fire damages',
            Icon: 'caught-on-fire',
            FieldId: 15
        },
        {
            Title: 'Rolled',
            Description: 'Capture evidence that your vehicle rolled',
            Icon: 'rolled',
            FieldId: 16
        },
        {
            Title: 'Undercarrige',
            Description: 'Capture the damages to the undercarrige of your vehicle',
            Icon: 'undercarrige',
            FieldId: 17
        },
        {
            Title: 'No Detail',
            Description: 'Capture damages not listed',
            Icon: 'no-detail',
            FieldId: 18
        },
        {
            Title: 'No Damage',
            Description: 'Capture evidence that there was no damage to your vehicle',
            Icon: 'no-damage',
            FieldId: 19
        },
        {
            Title: 'Windscreen / Window',
            Description: 'Capture the damages to your windscreen / window',
            Icon: 'windscreen',
            FieldId: 20
        }
    ];

    constructor(private storage: StorageService,
                private pageBuilder: PageBuilderService,
                private global: GlobalService,
                private nav: NavController,
                private messageBus: MessageBusService,
                private logger: LoggerService,
                private claimService:ClaimService) { }

    async initialize(initialPage: string) {
        try {
            this.sliderOptions['vehicleTypeOptions'] = this.pageBuilder.vehicleTypeOptions();
            this.sliderOptions['positionBeforeAccident'] = this.pageBuilder.positionBeforeAccident();
            this.sliderOptions['whatDriverWasDoingOptions'] = this.pageBuilder.whatDriverWasDoingOptions();
            this.sliderOptions['directionVehicleWasTravellingOptions'] = this.pageBuilder.directionVehicleWasTravellingOptions();
            this.sliderOptions['conditionOfVehicleLights'] = this.pageBuilder.goodFaultyUnknownOptions();
            this.sliderOptions['conditionOfReflectorsOptions'] = this.pageBuilder.goodFaultyUnknownOptions();
            this.sliderOptions['flatOrSlopedRoadOptions'] = this.pageBuilder.flatOrSlopedRoadOptions();

            this.savedInformation = await this.storage.getBulkARFormInputs([76, 92, 98, 100, 102, 254, 255]);

            //return this.getSliderOptions(initialPage);
        } catch (err) {
            this.logger.error('YourVehicleDamagesService::initialize', err);
        }
    }

    async loadSavedImages() {
        try {
            for (const capture of this.damageCaptures) {
                const savedCapture = await this.storage.getInstance<ICameraCaptureInfo>(`${Prefixes.MyVehicleDamages}${capture.Title}`);
                if (savedCapture && savedCapture.FullPath) {
                    const captureBase64 = await this.global.retrievePhoto(savedCapture);
                    if (captureBase64) {
                        capture.Base64 = captureBase64;
                    }
                }
            }
            return this.damageCaptures;
        } catch (err) {
            this.logger.error('YourVehicleDamagesService::loadSavedImages', err);
        }
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

    getSliderOptions(page: string,selectedValue:number) {
        // console.log("getSliderOptions", page, selectedValue);
        
        const pageKey = this.pageDataKeyMapping[page];
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
                return 'vehicleTypeOptions';
            case 1:
                return 'positionBeforeAccident';
            case 2:
                return 'whatDriverWasDoingOptions';
            case 3:
                return 'directionVehicleWasTravellingOptions';
            case 4:
                return 'conditionOfVehicleLights';
            case 5:
                return 'conditionOfReflectorsOptions';
            case 6:
                return 'flatOrSlopedRoadOptions';
            case 7:
                return 'IMAGES';
            default:
                return '';
        }
    }

    async captureImage(damage: IDamageCapture) {
        try {
            return await this.global.capturePhoto(`${Prefixes.MyVehicleDamages}${damage.Title}`);
        } catch (err) {
            this.logger.error('YourVehicleDamagesService::captureImage', err);
        }
    }
    async saveCapturedImage(damage: IDamageCapture, image: ICameraCaptureInfo) {
        try {
            await this.storage.saveImageCaptureInfo(`${Prefixes.MyVehicleDamages}${damage.Title}`, image);
            let savedDamages = await this.storage.getARFormInput(this.vehicleDamagesId);
            if (!savedDamages) {
                savedDamages = [];
            }
            if (savedDamages.indexOf(damage.FieldId) < 0) {
                savedDamages.push(damage.FieldId);
                await this.storage.setARFormInput(this.vehicleDamagesId, savedDamages);
            }
        } catch (err) {
            this.logger.error('YourVehicleDamagesService::saveCapturedImage', err);
        }
    }

    async saveSelection(key: number, selectedID: number) {
        console.log("saveSelection", key, selectedID);
        
        try {
            await this.storage.setARFormInput(key, selectedID);
        } catch (err) {
            this.logger.error('YourVehicleDamagesService::saveSelection', err);
        }
    }

    async finish(onlyPop: boolean) {
        if (onlyPop) {
            await this.nav.pop();
            return;
        }

        const doneModal = await this.global.modal(GenericPopupPage, {
            header: 'you are Done!',
            description: [
                'Next you will snap other drivers<br>vehicle damage ',
            ],
            title: 'You are done with snapping<br> <strong>Your Vehicle Damage</strong>',
            image: 'assets/lottie/section-done_84c64ab1.gif'
        }, 'small-popup');
        const result = await doneModal.onDidDismiss();
        if (result.data) {
            await this.nav.pop();
            return true;
        }
        return false;
    }

    async showSnapPopup() {
        await this.global.modal(GenericPopupPage, {
            header: 'Snap your vehicle damage',
            description: [
                'Snap your vehicle from all four sides<br> make sure your whole vehicle is <br>visible.'
            ],
            title: 'Snap the evidence not just<br> damages',
            layoverImage: 'assets/lottie/snap-your-vehicle.png',
            image: 'assets/lottie/animation_640_lhoy3rlp.gif'
            
        }, 'small-popup');
    }

    broadcastState(completionState: number, shouldContinue: boolean) {
        this.messageBus.sendMessageToHomePageMessageBus({
            State: completionState,
            TargetButton: 'YourVehicleDamage',
            GoToNext: shouldContinue ? 'TheirVehicleDamage' : ''
        });
    }

    async ServerSaveImage(imgData:ICameraCaptureInfo)
    {
        console.log(imgData.Base64)
        console.log(imgData)
        var formData=this.global.readFile(imgData);
        var token= await this.storage.get('WbAuth')
        var response= this.claimService.uploadImage(token,formData)
        return response
    }

    async SaveAccidentDamage(accidentDamageModel:YourVehicleDamageModel)
    {
      var token= await this.storage.get('WbAuth')
      var claim_id= await this.storage.get('ClaimAuth')
  
      if(token!='' && claim_id!='')
      {
      accidentDamageModel.claim_id=claim_id;
      let response= this.claimService.SaveYourAccidentDammage(token,accidentDamageModel);
      response.subscribe(result=>{
        console.log(result);
      })
      }
      
    }

    async GetYourVehicleDamage()
  {
      var token= await this.storage.get('WbAuth')
      var claim_id= await this.storage.get('ClaimAuth')
  
      if(token!='' && claim_id!='')
      {
      let response= this.claimService.getYourVehicleDamage(token,claim_id);
      return response;
      }
      
    }
}
