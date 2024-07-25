import { Injectable } from "@angular/core";
import { ClaimService } from "src/app/api/claim.service";
import { GlobalService } from "src/services/global.service";
import { LoggerService } from "src/services/logger.service";
import { ICameraCaptureInfo } from "src/services/models.service";
import { Prefixes, StorageService } from "src/services/storage.service";
import { trigger, style, state, animate, transition } from '@angular/animations';

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

export class LinkArNumberService{
constructor(private global: GlobalService, private logger: LoggerService, private storage: StorageService, private claimService: ClaimService){}

async captureImage() {
    try {
      return await this.global.capturePhoto(`${Prefixes.ARFormInput}`);
    } catch (err) {
      this.logger.error('LinkArNumberService::captureImage', err);
      return null;
    }
  }

  public rightImage1:string;
  async saveImage(imgData: ICameraCaptureInfo) {
    try {
      console.log(imgData);
      var formData=this.global.readFile(imgData);
      await this.storage.saveImageCaptureInfo(`${Prefixes.ARFormInput}`, imgData);
      var token= await this.storage.get('WbAuth')
      var response= this.claimService.uploadImage(token,formData)
      return response
    

    } catch (err) {
      this.logger.error('AccidentSceneService::saveImage', err);
    }
  }
  
}
