import { Injectable } from '@angular/core';

import { NavController } from '@ionic/angular';

import { StorageService, Prefixes } from '../../../../services/storage.service';
import { GlobalService } from '../../../../services/global.service';
import { ICameraCaptureInfo, IIconRadioOption } from '../../../../services/models.service';
import { MessageBusService } from '../../../../services/messagebus.service';
import { PageBuilderService } from '../../../../services/pagebuilder.service';
import { LoggerService } from '../../../../services/logger.service';

import { GenericPopupPage } from "src/modals/generic-popup/generic-popup.page";

import { trigger, style, state, animate, transition } from '@angular/animations';
import { readFile } from 'fs';
import { ClaimService } from "src/app/services/claim.service";
import { AccidentSceneModel } from "src/app/pages/tabs/Model/claim.model";

export const PageAnimations = [
  trigger('zoom', [
    state('open', style({ transform: 'scale(1)' })),
    state('closed', style({ transform: 'scale(0)' })),
    transition('open <=> closed', [
      animate(250)
    ])
  ])
];

@Injectable()
export class AccidentSceneService {

  private descriptionOfAccidentId = 117;
  private accidentTypeId = 114;

  constructor(private storage: StorageService,
              private global: GlobalService,
              private nav: NavController,
              private messageBus: MessageBusService,
              private pageBuilder: PageBuilderService,
              private logger: LoggerService,
              private claimService:ClaimService) { }

  async initialize(): Promise<InitializeData> {
    try {
      const frontImage = await this.storage.getInstance<ICameraCaptureInfo>(`${Prefixes.AccidentSceneCapture}Front`);
      const backImage = await this.storage.getInstance<ICameraCaptureInfo>(`${Prefixes.AccidentSceneCapture}Back`);
      const rightImage = await this.storage.getInstance<ICameraCaptureInfo>(`${Prefixes.AccidentSceneCapture}Right`);
      const leftImage = await this.storage.getInstance<ICameraCaptureInfo>(`${Prefixes.AccidentSceneCapture}Left`);

      const accidentTypes = this.pageBuilder.accidentTypeOptions();

      const savedInfo = await this.storage.getBulkARFormInputs([this.accidentTypeId, this.descriptionOfAccidentId]);

      const savedAccidentType = savedInfo[this.accidentTypeId];
      if (savedAccidentType) {
        const accidentTypeToEdit = accidentTypes.find(x => x.ID === savedAccidentType);
        if (accidentTypeToEdit) {
          accidentTypeToEdit.Selected = true;
        }
      }

      const data: InitializeData = {
        BackImage: await this.global.retrievePhoto(backImage),
        DescriptionOfAccident: savedInfo[this.descriptionOfAccidentId],
        FrontImage: await this.global.retrievePhoto(frontImage),
        LeftImage: await this.global.retrievePhoto(leftImage),
        RightImage: await this.global.retrievePhoto(rightImage),
        AccidentTypes: accidentTypes
      };

      return data;
    } catch (err) {
      this.logger.error('AccidentSceneService::initialize', err);
    }
  }

  async SetAccidentType(savedAccidentType:number)
  {
    const accidentTypes = this.pageBuilder.accidentTypeOptions();

    const accidentTypeToEdit = accidentTypes.find(x => x.ID === savedAccidentType);
        if (accidentTypeToEdit) {
          accidentTypeToEdit.Selected = true;
        }

        return accidentTypes;
  }

  // async captureImage(side: string) {
  //   try {
  //     return await this.global.capturePhoto(`${Prefixes.AccidentSceneCapture}${side}`);
  //   } catch (err) {
  //     this.logger.error('AccidentSceneService::captureImage', err);
  //     return null;
  //   }
  // }

  public rightImage1:string;

  async saveImage(side: string, imgData: ICameraCaptureInfo) {
    try {
      console.log('imgData+++++accident-scene-service+++++++++',imgData);
      var formData=this.global.readFile(imgData);
      console.log('formData+++++accident-scene-service+++++++++',formData);
      //await this.storage.saveImageCaptureInfo(`${Prefixes.AccidentSceneCapture}${side}`, imgData);
      var token= await this.storage.get('WbAuth')
      var response= this.claimService.uploadImage(token,formData)
      console.log('response of upload image+++++accident-scene-service+++++++++',response);
      return response
    } catch (err) {
      this.logger.error('AccidentSceneService::saveImage', err);
    }
  }


  async saveFormChanges(description: string) {
    try {
      await this.storage.setARFormInput(this.descriptionOfAccidentId, description);
    } catch (err) {
      this.logger.error('AccidentSceneService::saveFormChanges', err);
    }
  }

  async saveAccidentType(id: number) {
    try {
      await this.storage.setARFormInput(this.accidentTypeId, id);
      await this.storage.setARFormInput(116, this.getAccidentTypeImageName(id));
    } catch (err) {
      this.logger.error('AccidentSceneService::saveAccidentType', err);
    }
  }
  private getAccidentTypeImageName(accidentType: number) {
    let imageName = '';
    switch (accidentType) {
      case 1:
        imageName = 'rear_end';
        break;
      case 2:
        imageName = 'head_on';
        break;
      case 3:
        imageName = 'sideswipe_opposite';
        break;
      case 4:
        imageName = 'sideswipe_same';
        break;
      case 5:
        imageName = 't_bone';
        break;
      case 6:
        imageName = 'single_vehicle';
        break;
      case 7:
        imageName = 'overturned';
        break;
      case 8:
        imageName = 'with_pedestrian';
        break;
      case 9:
        imageName = 'with_animal';
        break;
      case 10:
        imageName = 'with_train';
        break;
      case 11:
        imageName = 'with_object';
        break;
    }
    return imageName;
  }

  async finish(justPop: boolean) {
    if (justPop) {
      await this.nav.pop();
      return;
    }
    const doneModal = await this.global.modal(GenericPopupPage, {
      header: 'You are Done!',
      description: [
        'Next you will snap your<br> vehicle damage',
      ],
      title: 'You are done with snapping<br><strong>Accident Scene </strong>',
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
      TargetButton: 'AccidentScene',
      GoToNext: shouldContinue ? 'YourVehicleDamage' : ''
    });
  }

  async SaveAccidentScene(accidentSceneModel:AccidentSceneModel)
  {
    var token= await this.storage.get('WbAuth')
    var claim_id= await this.storage.get('ClaimAuth')

    if(token!='' && claim_id!='')
    {
    accidentSceneModel.claim_id=claim_id;
    let response= this.claimService.SaveAccidentScene(token,accidentSceneModel);
    response.subscribe(result=>{
      console.log(result);
    })
    }
    
  }

  async GetAccidentScene()
      {
          var token= await this.storage.get('WbAuth')
          var claim_id= await this.storage.get('ClaimAuth')
      
          if(token!='' && claim_id!='')
          {
          let response= this.claimService.getAccidentSceneById(token,claim_id);
          return response;
          }
          
      }
}

interface InitializeData {
  FrontImage: string;
  BackImage: string;
  RightImage: string;
  LeftImage: string;
  DescriptionOfAccident: string;
  AccidentTypes: IIconRadioOption[];
}
