import { Component, OnInit, ViewChild } from '@angular/core';

import { IonSlides, ModalController } from '@ionic/angular';

import { RoadConditionsService, PageAnimations } from './road-conditions.service';

import { IIconRadioOption } from '../../../../services/models.service';

import { IconRadioListComponentComponent } from 'src/components/icon-radio-list-component/icon-radio-list-component.component'
import { RoadConditionModal } from 'src/app/pages/tabs/Model/claim.model';
import { MessageService } from 'src/app/services/message.service';
import { CameraCapacitorService } from 'src/app/services/camera-capacitor.service';
import { ARformPhotoGalleryComponent } from 'src/app/component/arform-photo-gallery/arform-photo-gallery.component';

@Component({
  selector: 'app-road-conditions',
  templateUrl: './road-conditions.page.html',
  styleUrls: ['./road-conditions.page.scss'],
  animations: PageAnimations,
  providers: [
    RoadConditionsService
  ]
})
export class RoadConditionsPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };
  totalSlides = 0;

  shouldContinueWithJourney = false;
  isIOS = false;

  @ViewChild('slider', { static: true }) slider: IonSlides;
  @ViewChild('evidenceIcon', { static: true }) evidenceIcon: IconRadioListComponentComponent;
  evidenceOpen = false;
  evidenceBase64 = '';
  private evidenceBeingCaptured = '';

  roadSurfaceTypeOptions: IIconRadioOption[] = [];
  roadTypeOptions: IIconRadioOption[] = [];
  roadSurfaceConditionOptions: IIconRadioOption[] = [];
  roadQualityOptions: IIconRadioOption[] = [];
  directionOfRoadOptions: IIconRadioOption[] = [];
  juntionTypeOptions: IIconRadioOption[] = [];
  trafficControlTypeOptions: IIconRadioOption[] = [];
  roadMarkingVisibilityOptions: IIconRadioOption[] = [];
  roadSignsVisibleOptions: IIconRadioOption[] = [];
  roadSignConditionOptions: IIconRadioOption[] = [];
  overtakingControlOptions: IIconRadioOption[] = [];
  obstructionOptions: IIconRadioOption[] = [];
  lightConditionOptions: IIconRadioOption[] = [];
  weatherConditionOptions: IIconRadioOption[] = [];

  optionsFieldIdBinding = {
    Road_Surface_Type: 108,
    Road_Type: 22,
    Road_Surface_Condition: 110,
    Road_Quality: 109,
    Road_Direction: 97,
    Junction_Type: 23,
    Traffic_Controls: 94,
    Road_Marking_Visibility: 111,
    Road_Sign_Visibility: 95,
    Road_Sign_Condition: 96,
    Overtaking_Control: 113,
    Obstruction: 112,
    Light_Condition: 106,
    Weather_Condition: 107
  };
  
  roadCondition:RoadConditionModal;
  getevidenceType: string;
  getOptionData: any;
  getCurrentIndex: number;
  constructor(private service: RoadConditionsService,
              public messageService: MessageService,
              public cameraCapacitorService: CameraCapacitorService,
              public modalCtrl: ModalController
               ) {
    this.roadCondition=new RoadConditionModal();
    this.service.initialize('');
    this.getRoadCondition();
  }

  async ngOnInit() {
    this.totalSlides = await this.slider.length();
    this.isIOS = this.service.isIOS();
    // this.roadSurfaceTypeOptions = await this.service.initialize('roadSurfaceTypeOptions');
    // this.getRoadCondition();
    // this.ReloadOptions();
    // await this.service.initialize('roadSurfaceTypeOptions');
  }



  async ionViewWillLeave() {
    const state = await this.calculateState();
    this.service.broadcastState(state, this.shouldContinueWithJourney);
  }

  async uploadEvidence(option: IIconRadioOption, evidenceType: string) {
    if (evidenceType != '') {

      if (evidenceType == 'Road_Surface_Type') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }
      if (evidenceType == 'Road_Type') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }
      if (evidenceType == 'Road_Surface_Condition') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }
      if (evidenceType == 'Road_Quality') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }
      if (evidenceType == 'Road_Direction') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }
      if (evidenceType == 'Junction_Type') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }
      if (evidenceType == 'Traffic_Controls') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }
      if (evidenceType == 'Road_Marking_Visibility') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }
      if (evidenceType == 'Road_Sign_Visibility') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }
      if (evidenceType == 'Road_Sign_Condition') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }
      if (evidenceType == 'Overtaking_Control') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }
      if (evidenceType == 'Obstruction') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }
      if (evidenceType == 'Light_Condition') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }
      if (evidenceType == 'Weather_Condition') {
        this.getOptionData = option;
        this.getevidenceType = evidenceType;
      }

      switch (this.optionsFieldIdBinding[evidenceType]) {
        case 108:
          this.roadCondition.surface_type = option.ID.toString();
          break;
        case 22:
          this.roadCondition.road_type_was = option.ID.toString();
          break;
        case 110:
          this.roadCondition.surface_was = option.ID.toString();
          break;
  
        case 109:
          this.roadCondition.road_quality = option.ID.toString();
          break;
        case 97:
          this.roadCondition.road_direction = option.ID.toString();
          break;
        case 23:
          this.roadCondition.junction_type = option.ID.toString();
          break;
        case 94:
          this.roadCondition.traffic_control = option.ID.toString();
          break;
        case 111:
          this.roadCondition.visibility_road_marking = option.ID.toString();
          break;
        case 95:
          this.roadCondition.road_sign_visible = option.ID.toString();
          break;
        case 96:
          this.roadCondition.condition_road_sign = option.ID.toString();
          break;
        case 113:
          this.roadCondition.overtaking_control = option.ID.toString();
          break;
        case 112:
          this.roadCondition.obstructions = option.ID.toString();
          break;
        case 106:
          this.roadCondition.light_condition = option.ID.toString();
          break;
        case 107:
          this.roadCondition.weather_condition = option.ID.toString();
          break;
      }
  
  

      // return this.getOptionData, this.getevidenceType
    }
    await this.service.saveSelection(this.optionsFieldIdBinding[evidenceType], option.ID);

    if (!option.ID) {
      await this.service.deleteEvidence(evidenceType);
    }

    
  }

  async openEvidenceCapture(option: IIconRadioOption, evidenceType: string) {
    const evidenceBase64 = await this.service.getEvidence(evidenceType);
    this.evidenceIcon.options = [];
    setTimeout(() => {
      this.evidenceIcon.options = [{
        Description: option.Description,
        Image: option.Image,
        ID: 0
      }];
      this.evidenceBase64 = evidenceBase64;
      this.evidenceBeingCaptured = evidenceType;
      this.evidenceOpen = true;
    });
  }


  async captureImage() {
    const popover = await this.modalCtrl.create({
      component: ARformPhotoGalleryComponent,
      cssClass: 'login-unlock-modal-class-d',
    });
    await popover.present();
    const image = await popover.onDidDismiss();
    console.log('image++++++  ts  ++++++++',image);
    if (image?.data.mode === 'camera' && image.data.FileName !== "") {
      let response= await this.service.ServerSaveImage(image.data);

      response.subscribe((result:any)=>
        {
          console.log(result);
          if(result.operation=='success')
          {
            switch (this.evidenceBeingCaptured) {
              case 'Road_Surface_Type':
                this.roadCondition.surface_type_evidence_image = result.data.imagename;
                break;
              case 'Road_Type':
                this.roadCondition.road_type_was_evidence_image = result.data.imagename;
                break;
              case 'Road_Surface_Condition':
                this.roadCondition.surface_was_evidence_image = result.data.imagename;
                break;
              case 'Road_Quality':
                this.roadCondition.road_quality_evidence_image = result.data.imagename;
                break;
              case 'Road_Direction':
                this.roadCondition.road_direction_evidence_image = result.data.imagename;
                break;
              case 'Junction_Type':
                this.roadCondition.junction_type_evidence_image = result.data.imagename;
                break;
              case 'Traffic_Controls':
                this.roadCondition.traffic_control_evidence_image = result.data.imagename;
                break;
              case 'Road_Marking_Visibility':
                this.roadCondition.visibility_road_marking_evidence_image = result.data.imagename;
                break;
              case 'Road_Sign_Visibility':
                this.roadCondition.road_sign_visible_evidence_image = result.data.imagename;
                break;
              case 'Road_Sign_Condition':
                this.roadCondition.condition_road_sign_evidence_image = result.data.imagename;
                break;
              case 'Overtaking_Control':
                this.roadCondition.overtaking_control_evidence_image = result.data.imagename;
                break;
              case 'Obstruction':
                this.roadCondition.obstructions_evidence_image = result.data.imagename;
                break;
              case 'Light_Condition':
                this.roadCondition.light_condition_evidence_image = result.data.imagename;
                break;
              case 'Weather_Condition':
                this.roadCondition.weather_condition_evidence_image = result.data.imagename;
                break;
            }
          }
        })

      this.evidenceBase64 = `${image.data.Base64}`;
      await this.service.saveCapturedImage( this.evidenceBeingCaptured, image.data);      
    }else if (image?.data.mode === 'gallery' && image.data.FileName !== "" && (image.data.imageType === 'jpeg' || image.data.imageType === 'jpg' || image.data.imageType === 'png')) {
      let response= await this.service.ServerSaveImage(image.data);

        response.subscribe((result:any)=>
          {
            console.log(result);
            if(result.operation=='success')
            {
              switch (this.evidenceBeingCaptured) {
                case 'Road_Surface_Type':
                  this.roadCondition.surface_type_evidence_image = result.data.imagename;
                  break;
                case 'Road_Type':
                  this.roadCondition.road_type_was_evidence_image = result.data.imagename;
                  break;
                case 'Road_Surface_Condition':
                  this.roadCondition.surface_was_evidence_image = result.data.imagename;
                  break;
                case 'Road_Quality':
                  this.roadCondition.road_quality_evidence_image = result.data.imagename;
                  break;
                case 'Road_Direction':
                  this.roadCondition.road_direction_evidence_image = result.data.imagename;
                  break;
                case 'Junction_Type':
                  this.roadCondition.junction_type_evidence_image = result.data.imagename;
                  break;
                case 'Traffic_Controls':
                  this.roadCondition.traffic_control_evidence_image = result.data.imagename;
                  break;
                case 'Road_Marking_Visibility':
                  this.roadCondition.visibility_road_marking_evidence_image = result.data.imagename;
                  break;
                case 'Road_Sign_Visibility':
                  this.roadCondition.road_sign_visible_evidence_image = result.data.imagename;
                  break;
                case 'Road_Sign_Condition':
                  this.roadCondition.condition_road_sign_evidence_image = result.data.imagename;
                  break;
                case 'Overtaking_Control':
                  this.roadCondition.overtaking_control_evidence_image = result.data.imagename;
                  break;
                case 'Obstruction':
                  this.roadCondition.obstructions_evidence_image = result.data.imagename;
                  break;
                case 'Light_Condition':
                  this.roadCondition.light_condition_evidence_image = result.data.imagename;
                  break;
                case 'Weather_Condition':
                  this.roadCondition.weather_condition_evidence_image = result.data.imagename;
                  break;
              }
            }
          })
         this.evidenceBase64 = `${image.data.Base64}`;
        await this.service.saveCapturedImage(this.evidenceBeingCaptured, image.data);
    }
    else if (image?.data.mode === 'gallery' && image.data.FileName !== "" && (image.data.imageType !== 'jpeg' || image.data.imageType !== 'jpg' || image.data.imageType !== 'png')) {
      this.messageService.presentErrorToast("Only images can be uplaod.")
    }
    else{
      this.messageService.presentErrorToast("somthing went wrong!!! PLease try again.")
    }
  }


  

  closeEvidence() {
    this.evidenceOpen = false;
    setTimeout(() => {
      this.evidenceIcon.options = [];
      this.evidenceBase64 = '';
      this.evidenceBeingCaptured = '';
    }, 300);
  }

  async sliderChanged(currentIndex: number) {
    const pageDataToLoad = this.service.getSliderIndexPageMapping(currentIndex);
    console.log("currentIndex", currentIndex);
    this.getCurrentIndex = currentIndex;
    
    if (!pageDataToLoad) {
      return;
    }

    if (this[pageDataToLoad].length === 0) {
      this[pageDataToLoad] = this.service.getSliderOptionsSlide(pageDataToLoad);
    }
  }

  async backClicked() {
    const currentIndex = await this.slider.getActiveIndex();
    if (currentIndex === 0) {
      await this.service.finish(true);
    } else {
      if (this.evidenceOpen) {
        this.closeEvidence();
      }
      await this.slider.slidePrev();
    }
  }


  // async nextClicked() {
  //   console.log(this.roadCondition);
  //   const currentIndex = await this.slider.getActiveIndex();
  //   if (currentIndex + 1 < this.totalSlides) {
  //     if (this.evidenceOpen) {
  //       this.closeEvidence();
  //     }
  //     await this.slider.slideNext();
  //   } else {
  //     this.shouldContinueWithJourney = await this.service.finish(false);
  //     await this.service.SaveAccidentDamage(this.roadCondition);
  //   }
  // }

  async nextClicked() {
console.log(this.roadTypeOptions);
    // if (this.getevidenceType == 'Road_Surface_Type' && this.getOptionData != undefined) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //       this.getevidenceType = '';
    //       this.getOptionData = '';
    //       this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }
    // else if (this.getevidenceType == 'Road_Type' && this.getOptionData != undefined && this.getCurrentIndex == 1) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //         this.getevidenceType = '';
    //         this.getOptionData = '';
    //         this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }


    // else if (this.getevidenceType == 'Road_Surface_Condition' && this.getOptionData != undefined && this.getCurrentIndex == 2) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //         this.getevidenceType = '';
    //         this.getOptionData = '';
    //         this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }



    // else if (this.getevidenceType == 'Road_Quality' && this.getOptionData != undefined && this.getCurrentIndex == 3) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //         this.getevidenceType = '';
    //         this.getOptionData = '';
    //         this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }






    // else if (this.getevidenceType == 'Road_Direction' && this.getOptionData != undefined && this.getCurrentIndex == 4) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //         this.getevidenceType = '';
    //         this.getOptionData = '';
    //         this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }



    // else if (this.getevidenceType == 'Junction_Type' && this.getOptionData != undefined && this.getCurrentIndex == 5) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //         this.getevidenceType = '';
    //         this.getOptionData = '';
    //         this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }




    // else if (this.getevidenceType == 'Traffic_Controls' && this.getOptionData != undefined && this.getCurrentIndex == 6) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //         this.getevidenceType = '';
    //         this.getOptionData = '';
    //         this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }



    // else if (this.getevidenceType == 'Road_Marking_Visibility' && this.getOptionData != undefined && this.getCurrentIndex == 7) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //         this.getevidenceType = '';
    //         this.getOptionData = '';
    //         this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }




    // else if (this.getevidenceType == 'Road_Sign_Visibility' && this.getOptionData != undefined && this.getCurrentIndex == 8) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //         this.getevidenceType = '';
    //         this.getOptionData = '';
    //         this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }



    // else if (this.getevidenceType == 'Road_Sign_Condition' && this.getOptionData != undefined && this.getCurrentIndex == 9) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //         this.getevidenceType = '';
    //         this.getOptionData = '';
    //         this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }


   
    // else if (this.getevidenceType == 'Overtaking_Control' && this.getOptionData != undefined && this.getCurrentIndex == 10) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //         this.getevidenceType = '';
    //         this.getOptionData = '';
    //         this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }



    // else if (this.getevidenceType == 'Obstruction' && this.getOptionData != undefined && this.getCurrentIndex == 11) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //         this.getevidenceType = '';
    //         this.getOptionData = '';
    //         this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }



    // else if (this.getevidenceType == 'Light_Condition' && this.getOptionData != undefined && this.getCurrentIndex == 12) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //         this.getevidenceType = '';
    //         this.getOptionData = '';
    //         this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }


    // else if (this.getevidenceType == 'Weather_Condition' && this.getOptionData != undefined && this.getCurrentIndex == 13) {
    //   console.log(this.roadCondition);
    //   console.log(this.getevidenceType);
    //   const currentIndex = await this.slider.getActiveIndex();
    //   if (currentIndex + 1 < this.totalSlides) {
    //     if (this.evidenceOpen) {
    //         this.getevidenceType = '';
    //         this.getOptionData = '';
    //         this.closeEvidence();
    //     }
    //     await this.slider.slideNext();
    //   } else {
    //     this.shouldContinueWithJourney = await this.service.finish(false);
    //     await this.service.SaveAccidentDamage(this.roadCondition);
    //   }
    // }



   
    // else{ 
    //   this.messageService.presentToast('Please select one of the followings.');
    //   console.log(this.getevidenceType);
    // }




    const currentIndex = await this.slider.getActiveIndex();
    if (currentIndex + 1 < this.totalSlides) {
      await this.slider.slideNext();
    } else {
      this.shouldContinueWithJourney = await this.service.finish(false);
        await this.service.SaveAccidentDamage(this.roadCondition);
    }
  }

  private async calculateState() {
    let nothingSet = true;
    let isEverythingSet = true;
    for (const pageMap in this.service.pageDataKeyMapping) {
      if (this[pageMap]) {
        if (this[pageMap].length === 0) {
          this[pageMap] = await this.service.getSliderOptionsSlide(pageMap);
        }
        const options: IIconRadioOption[] = this[pageMap];
        if (!options.find(x => x.Selected)) {
          isEverythingSet = false;
        } else {
          nothingSet = false;
        }
      }
    }

    return nothingSet ? 0 : isEverythingSet ? 2 : 1;
  }


  async getRoadCondition()
  {
    var response= await this.service.getRoadCondition();
    response.subscribe(async (result:any)=>{
      console.log(result);
      if(result.operation=='success')
      {

        this.roadCondition=result.data as RoadConditionModal;
  //       var imgaeFullPath=result.data.image_full_path;


        //  this.damageCaptures.forEach(element => {
            
        //   switch(element.Title)
        //   {
        //   case 'Road_Surface_Type':
        //     this.roadCondition.surface_type_evidence_image = result.data.imagename;
        //     break;
        //   case 'Road_Type':
        //     this.roadCondition.road_type_was_evidence_image = result.data.imagename;
        //     break;
        //   case 'Road_Surface_Condition':
        //     this.roadCondition.surface_was_evidence_image = result.data.imagename;
        //     break;
        //   case 'Road_Quality':
        //     this.roadCondition.road_quality_evidence_image = result.data.imagename;
        //     break;
        //   case 'Road_Direction':
        //     this.roadCondition.road_direction_evidence_image = result.data.imagename;
        //     break;
        //   case 'Junction_Type':
        //     this.roadCondition.junction_type_evidence_image = result.data.imagename;
        //     break;
        //   case 'Traffic_Controls':
        //     this.roadCondition.traffic_control_evidence_image = result.data.imagename;
        //     break;
        //   case 'Road_Marking_Visibility':
        //     this.roadCondition.visibility_road_marking_evidence_image = result.data.imagename;
        //     break;
        //   case 'Road_Sign_Visibility':
        //     this.roadCondition.road_sign_visible_evidence_image = result.data.imagename;
        //     break;
        //   case 'Road_Sign_Condition':
        //     this.roadCondition.condition_road_sign_evidence_image = result.data.imagename;
        //     break;
        //   case 'Overtaking_Control':
        //     this.roadCondition.overtaking_control_evidence_image = result.data.imagename;
        //     break;
        //   case 'Obstruction':
        //     this.roadCondition.obstructions_evidence_image = result.data.imagename;
        //     break;
        //   case 'Light_Condition':
        //     this.roadCondition.light_condition_evidence_image = result.data.imagename;
        //     break;
        //   case 'Weather_Condition':
        //     this.roadCondition.weather_condition_evidence_image = result.data.imagename;
        //     break;
        //   }

        //   });      // comment cause need to be implement in service.ts file

          
       this.ReloadOptions();

      }
    });
    this.ReloadOptions();
  }

      async ReloadOptions()
  {
    this.roadSurfaceTypeOptions = await this.service.getSliderOptions('roadSurfaceTypeOptions',Number(this.roadCondition.surface_type));
    this.roadTypeOptions=await this.service.getSliderOptions('roadTypeOptions',Number(this.roadCondition.road_type_was))

    this.roadSurfaceConditionOptions = await this.service.getSliderOptions('roadSurfaceConditionOptions',Number(this.roadCondition.surface_was));
    this.roadQualityOptions=await this.service.getSliderOptions('roadQualityOptions',Number(this.roadCondition.road_quality))

    this.directionOfRoadOptions = await this.service.getSliderOptions('directionOfRoadOptions',Number(this.roadCondition.road_direction));
    this.juntionTypeOptions=await this.service.getSliderOptions('juntionTypeOptions',Number(this.roadCondition.junction_type))
    this.trafficControlTypeOptions = await this.service.getSliderOptions('trafficControlTypeOptions',Number(this.roadCondition.traffic_control));
    this.roadMarkingVisibilityOptions = await this.service.getSliderOptions('roadMarkingVisibilityOptions',Number(this.roadCondition.visibility_road_marking));
    this.roadSignsVisibleOptions = await this.service.getSliderOptions('roadSignsVisibleOptions',Number(this.roadCondition.road_sign_visible));
    this.roadSignConditionOptions = await this.service.getSliderOptions('roadSignConditionOptions',Number(this.roadCondition.condition_road_sign));
    this.overtakingControlOptions = await this.service.getSliderOptions('overtakingControlOptions',Number(this.roadCondition.overtaking_control));
    this.obstructionOptions = await this.service.getSliderOptions('obstructionOptions',Number(this.roadCondition.obstructions));
    this.lightConditionOptions = await this.service.getSliderOptions('lightConditionOptions',Number(this.roadCondition.light_condition));
    this.weatherConditionOptions = await this.service.getSliderOptions('weatherConditionOptions',Number(this.roadCondition.weather_condition));

  
  }
     
      
   
  

}
