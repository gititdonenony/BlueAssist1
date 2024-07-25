import { Component, OnInit, ViewChild } from "@angular/core";

import {
  YourVehicleDamagesService,
  PageAnimations,
} from "./your-vehicle-damages.service";

import { IonSlides, ModalController } from "@ionic/angular";

import {
  IIconRadioOption,
  IDamageCapture,
} from "../../../../services/models.service";
import { YourVehicleDamageModel } from "src/app/pages/tabs/Model/claim.model";
import { YourVehicleDamagesPageModule } from "./your-vehicle-damages.module";
import {
  ToastController,
  AlertController,
  LoadingController,
  NavController,
} from "@ionic/angular";
import { MessageService } from "src/app/services/message.service";
import { CameraCapacitorService } from "src/app/services/camera-capacitor.service";
import { ARformPhotoGalleryComponent } from "src/app/component/arform-photo-gallery/arform-photo-gallery.component";

@Component({
  selector: "app-your-vehicle-damages",
  templateUrl: "./your-vehicle-damages.page.html",
  styleUrls: ["./your-vehicle-damages.page.scss"],
  animations: PageAnimations,
  providers: [YourVehicleDamagesService],
})
export class YourVehicleDamagesPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true,
  };
  totalSlides = 0;

  shouldContinueWithJourney = false;

  alreadyFetchedImages = false;

  vehicleTypeOptions: IIconRadioOption[] = [];
  positionBeforeAccident: IIconRadioOption[] = [];
  whatDriverWasDoingOptions: IIconRadioOption[] = [];
  directionVehicleWasTravellingOptions: IIconRadioOption[] = [];
  conditionOfVehicleLights: IIconRadioOption[] = [];
  conditionOfReflectorsOptions: IIconRadioOption[] = [];
  flatOrSlopedRoadOptions: IIconRadioOption[] = [];

  damageCaptures: IDamageCapture[] = [];
  optionsFieldIdBinding = {
    VehicleType: 92,
    VehiclePosition: 100,
    BusyDoing: 102,
    TravelDirection: 76,
    VehicleLights: 254,
    VehicleReflectors: 255,
    FlatOrSloped: 98,
  };

  yourVehicleDamage: YourVehicleDamageModel;

  @ViewChild("slider", {
    static: true,
  })
  slider: IonSlides;
  getSelectedData: any;
  getProperTy: string;
  getCurrentIndex: number;
  getBaseImage: string;

  constructor(
    private service: YourVehicleDamagesService,
    private toastctrl: ToastController,
    public messageService: MessageService,
    public cameraCapacitorService: CameraCapacitorService,
    public modalCtrl: ModalController
  ) {
    this.yourVehicleDamage = new YourVehicleDamageModel();
    this.service.initialize("");

    this.damageCaptures = this.service.damageCaptures;

    this.GetVehicleDamage();
  }

  async ngOnInit() {
    this.totalSlides = await this.slider.length();
  }

  async ionViewWillLeave() {
    const state = await this.calculateState();
    this.service.broadcastState(state, this.shouldContinueWithJourney);
  }

  async sliderChanged(currentIndex: number) {
    ////console.log(currentIndex);
    this.getCurrentIndex = currentIndex;
    if (currentIndex === this.totalSlides - 1) {
      await this.service.showSnapPopup();
      ////console.log(currentIndex);
    }

    const pageDataToLoad = this.service.getSliderIndexPageMapping(currentIndex);
    if (!pageDataToLoad) {
      return;
    }

    if (pageDataToLoad !== "IMAGES" && this[pageDataToLoad].length === 0) {
      this[pageDataToLoad] = this.service.getSliderOptionsSlide(pageDataToLoad);
    } else if (pageDataToLoad === "IMAGES" && !this.alreadyFetchedImages) {
      this.alreadyFetchedImages = true;
      this.damageCaptures = await this.service.loadSavedImages();
    }
  }


  async captureImage(capture: IDamageCapture) {
    const popover = await this.modalCtrl.create({
      component: ARformPhotoGalleryComponent,
      cssClass: 'login-unlock-modal-class-d',
    });
    await popover.present();
    const image = await popover.onDidDismiss();
    console.log('image++++++ ts ++++++++',image);
    if (image?.data.mode === 'camera' && image.data.FileName !== "") {
         
      capture.Base64 = `${image.data.Base64}`;

      this.getBaseImage = image.data.Base64;
      ////console.log(image.Base64);
      let response = await this.service.ServerSaveImage(image.data);

      response.subscribe((result: any) => {
        ////console.log(result);
        if (result.operation == "success") {
          switch (capture.Title) {
            case "Front":
              this.yourVehicleDamage.vehicle_damages_front_image =
                result.data.imagename;
              break;
            case "Front Right":
              this.yourVehicleDamage.front_right_image = result.data.imagename;
              break;
            case "Front Left":
              this.yourVehicleDamage.front_left_image = result.data.imagename;
              break;
            case "Back":
              this.yourVehicleDamage.back_image = result.data.imagename;
              break;
            case "Back Right":
              this.yourVehicleDamage.back_right_image = result.data.imagename;
              break;
            case "Back Left":
              this.yourVehicleDamage.back_left_image = result.data.imagename;
              break;
            case "Left Front":
              this.yourVehicleDamage.left_front_image = result.data.imagename;
              break;
            case "Left Back":
              this.yourVehicleDamage.left_back_image = result.data.imagename;
              break;
            case "Right Front":
              this.yourVehicleDamage.right_front_image = result.data.imagename;
              break;
            case "Right Back":
              this.yourVehicleDamage.right_back_image = result.data.imagename;
              break;

            case "Bonnet":
              this.yourVehicleDamage.bonnet_image = result.data.imagename;
              break;
            case "Roof":
              this.yourVehicleDamage.roof_image = result.data.imagename;
              break;
            case "Boot":
              this.yourVehicleDamage.boot_image = result.data.imagename;
              break;
            case "Multiple":
              this.yourVehicleDamage.multiple_damage_image =
                result.data.imagename;
              break;
            case "Caught on Fire":
              this.yourVehicleDamage.caughtonfire_image = result.data.imagename;
              break;
            case "Rolled":
              this.yourVehicleDamage.rolled_image = result.data.imagename;
              break;
            case "Undercarrige":
              this.yourVehicleDamage.under_carrige_image =
                result.data.imagename;
              break;
            case "No Detail":
              this.yourVehicleDamage.no_details_image = result.data.imagename;
              break;
            case "No Damage":
              this.yourVehicleDamage.no_damage_image = result.data.imagename;
              break;
            case "Windscreen / Window":
              this.yourVehicleDamage.windoworwindscreen_image =
                result.data.imagename;
              break;
          }

          capture.Base64 = result.data.imagepath;
        }
      });

      // await this.service.saveCapturedImage(capture, image);
          
    }
    else if (image?.data.mode === 'gallery' && image.data.FileName !== "" && (image.data.imageType === 'jpeg' || image.data.imageType === 'jpg' || image.data.imageType === 'png')) {
    
      capture.Base64 = `${image.data.Base64}`;

      this.getBaseImage = image.data.Base64;
      ////console.log(image.Base64);
      let response = await this.service.ServerSaveImage(image.data);

      response.subscribe((result: any) => {
        ////console.log(result);
        if (result.operation == "success") {
          switch (capture.Title) {
            case "Front":
              this.yourVehicleDamage.vehicle_damages_front_image =
                result.data.imagename;
              break;
            case "Front Right":
              this.yourVehicleDamage.front_right_image = result.data.imagename;
              break;
            case "Front Left":
              this.yourVehicleDamage.front_left_image = result.data.imagename;
              break;
            case "Back":
              this.yourVehicleDamage.back_image = result.data.imagename;
              break;
            case "Back Right":
              this.yourVehicleDamage.back_right_image = result.data.imagename;
              break;
            case "Back Left":
              this.yourVehicleDamage.back_left_image = result.data.imagename;
              break;
            case "Left Front":
              this.yourVehicleDamage.left_front_image = result.data.imagename;
              break;
            case "Left Back":
              this.yourVehicleDamage.left_back_image = result.data.imagename;
              break;
            case "Right Front":
              this.yourVehicleDamage.right_front_image = result.data.imagename;
              break;
            case "Right Back":
              this.yourVehicleDamage.right_back_image = result.data.imagename;
              break;

            case "Bonnet":
              this.yourVehicleDamage.bonnet_image = result.data.imagename;
              break;
            case "Roof":
              this.yourVehicleDamage.roof_image = result.data.imagename;
              break;
            case "Boot":
              this.yourVehicleDamage.boot_image = result.data.imagename;
              break;
            case "Multiple":
              this.yourVehicleDamage.multiple_damage_image =
                result.data.imagename;
              break;
            case "Caught on Fire":
              this.yourVehicleDamage.caughtonfire_image = result.data.imagename;
              break;
            case "Rolled":
              this.yourVehicleDamage.rolled_image = result.data.imagename;
              break;
            case "Undercarrige":
              this.yourVehicleDamage.under_carrige_image =
                result.data.imagename;
              break;
            case "No Detail":
              this.yourVehicleDamage.no_details_image = result.data.imagename;
              break;
            case "No Damage":
              this.yourVehicleDamage.no_damage_image = result.data.imagename;
              break;
            case "Windscreen / Window":
              this.yourVehicleDamage.windoworwindscreen_image =
                result.data.imagename;
              break;
          }

          capture.Base64 = result.data.imagepath;
        }
      });

      // await this.service.saveCapturedImage(capture, image);
    }
    else if (image?.data.mode === 'gallery' && image.data.FileName !== "" && (image.data.imageType !== 'jpeg' || image.data.imageType !== 'jpg' || image.data.imageType !== 'png')) {
      this.messageService.presentErrorToast("Only images can be uplaod.")
    }
    else{
      this.messageService.presentErrorToast("somthing went wrong!!! PLease try again.")
    }
  }

 

  async saveSelection(selection: IIconRadioOption, property: string) {
    ////console.log("saveSelection", selection, property);
    ////console.log(this.optionsFieldIdBinding[property]);
    if (property != "") {
      if (property == "VehicleType") {
        this.getSelectedData = selection;
        this.getProperTy = property;
      }
      if (property == "VehiclePosition") {
        this.getSelectedData = selection;
        this.getProperTy = property;
      }
      if (property == "BusyDoing") {
        this.getSelectedData = selection;
        this.getProperTy = property;
      }
      if (property == "TravelDirection") {
        this.getSelectedData = selection;
        this.getProperTy = property;
      }
      if (property == "VehicleLights") {
        this.getSelectedData = selection;
        this.getProperTy = property;
      }
      if (property == "VehicleReflectors") {
        this.getSelectedData = selection;
        this.getProperTy = property;
      }
      if (property == "FlatOrSloped") {
        this.getSelectedData = selection;
        this.getProperTy = property;
      }

      if (this.optionsFieldIdBinding[property]) {
        switch (this.optionsFieldIdBinding[property]) {
          case 92:
            this.yourVehicleDamage.vehicle_type = selection.ID.toString();
            break;
          case 100:
            this.yourVehicleDamage.vehicle_position_before_accident =
              selection.ID.toString();
            break;
          case 102:
            this.yourVehicleDamage.you_doing = selection.ID.toString();

            break;
          case 76:
            this.yourVehicleDamage.vehicle_direction = selection.ID.toString();

            break;
          case 254:
            this.yourVehicleDamage.cond_vehicle_light = selection.ID.toString();

            break;
          case 255:
            this.yourVehicleDamage.cond_veh_reflector = selection.ID.toString();
            break;
          case 98:
            this.yourVehicleDamage.road_road_flatorsloped =
              selection.ID.toString();
            break;
        }

        //await this.service.saveSelection(this.optionsFieldIdBinding[property], selection.ID);
      }
      return this.getSelectedData, this.getProperTy;
    }
  }


  

  async backClicked() {
    const currentIndex = await this.slider.getActiveIndex();
    if (currentIndex === 0) {
      await this.service.finish(true);
    } else {
      await this.slider.slidePrev();
    }
  }

  async nextClicked() {
    //   if (this.getProperTy == 'VehicleType' && this.getSelectedData != undefined) {
    //     ////console.log("this.getSelectedData", this.getSelectedData);
    //     const currentIndex = await this.slider.getActiveIndex();
    //     if (currentIndex + 1 < this.totalSlides) {
    //       this.getProperTy = '';
    //       this.getSelectedData = '';
    //       await this.slider.slideNext();
    //     } else {
    //       this.shouldContinueWithJourney = await this.service.finish(false);
    //       await this.service.SaveAccidentDamage(this.yourVehicleDamage);
    //     }
    //   }
    //   else if (this.getProperTy == 'VehiclePosition' && this.getSelectedData != undefined && this.getCurrentIndex == 1) {
    //     ////console.log("this.getSelectedData", this.getSelectedData);
    //     const currentIndex = await this.slider.getActiveIndex();
    //     if (currentIndex + 1 < this.totalSlides) {
    //       this.getProperTy = '';
    //       this.getSelectedData = '';
    //       await this.slider.slideNext();
    //     } else {
    //       this.shouldContinueWithJourney = await this.service.finish(false);
    //       await this.service.SaveAccidentDamage(this.yourVehicleDamage);
    //     }
    //   }
    //   else if (this.getProperTy == 'BusyDoing' && this.getSelectedData != undefined && this.getCurrentIndex == 2) {
    //     ////console.log("this.getSelectedData", this.getSelectedData);
    //     const currentIndex = await this.slider.getActiveIndex();
    //     if (currentIndex + 1 < this.totalSlides) {
    //       this.getProperTy = '';
    //       this.getSelectedData = '';
    //       await this.slider.slideNext();
    //     } else {
    //       this.shouldContinueWithJourney = await this.service.finish(false);
    //       await this.service.SaveAccidentDamage(this.yourVehicleDamage);
    //     }
    //   }
    //   else if (this.getProperTy == 'TravelDirection' && this.getSelectedData != undefined && this.getCurrentIndex == 3) {
    //     ////console.log("this.getSelectedData", this.getSelectedData);
    //     const currentIndex = await this.slider.getActiveIndex();
    //     if (currentIndex + 1 < this.totalSlides) {
    //       this.getProperTy = '';
    //       this.getSelectedData = '';
    //       await this.slider.slideNext();
    //     } else {
    //       this.shouldContinueWithJourney = await this.service.finish(false);
    //       await this.service.SaveAccidentDamage(this.yourVehicleDamage);
    //     }
    //   }
    //   else if (this.getProperTy == 'VehicleLights' && this.getSelectedData != undefined && this.getCurrentIndex == 4) {
    //     ////console.log("this.getSelectedData", this.getSelectedData);
    //     const currentIndex = await this.slider.getActiveIndex();
    //     if (currentIndex + 1 < this.totalSlides) {
    //       this.getProperTy = '';
    //       this.getSelectedData = '';
    //       await this.slider.slideNext();
    //     } else {
    //       this.shouldContinueWithJourney = await this.service.finish(false);
    //       await this.service.SaveAccidentDamage(this.yourVehicleDamage);
    //     }
    //   }
    //   else if (this.getProperTy == 'VehicleReflectors' && this.getSelectedData != undefined && this.getCurrentIndex == 5) {
    //     ////console.log("this.getSelectedData", this.getSelectedData);
    //     const currentIndex = await this.slider.getActiveIndex();
    //     if (currentIndex + 1 < this.totalSlides) {
    //       this.getProperTy = '';
    //       this.getSelectedData = '';
    //       await this.slider.slideNext();
    //     } else {
    //       this.shouldContinueWithJourney = await this.service.finish(false);
    //       await this.service.SaveAccidentDamage(this.yourVehicleDamage);
    //     }
    //   }
    //   else if (this.getProperTy == 'FlatOrSloped' && this.getSelectedData != undefined && this.getCurrentIndex == 6) {
    //     //console.log("this.getSelectedData", this.getSelectedData);
    //     const currentIndex = await this.slider.getActiveIndex();
    //     if (currentIndex + 1 < this.totalSlides) {
    //       this.getProperTy = '';
    //       this.getSelectedData = '';
    //       await this.slider.slideNext();
    //     } else {
    //       this.shouldContinueWithJourney = await this.service.finish(false);
    //       await this.service.SaveAccidentDamage(this.yourVehicleDamage);
    //     }
    //   }
    //   else if (this.getBaseImage != undefined && this.getCurrentIndex == 7) {
    //     //console.log("this.getSelectedData", this.getSelectedData);
    //     const currentIndex = await this.slider.getActiveIndex();
    //     if (currentIndex + 1 < this.totalSlides) {
    //       this.getBaseImage = '';
    //       await this.slider.slideNext();
    //     } else {
    //       this.shouldContinueWithJourney = await this.service.finish(false);
    //       await this.service.SaveAccidentDamage(this.yourVehicleDamage);
    //     }
    //   }
    //   else{
    //       this.messageService.presentToast('Please select one of the followings.');
    //   }
    const currentIndex = await this.slider.getActiveIndex();
    if (currentIndex + 1 < this.totalSlides) {
      await this.slider.slideNext();
    } else {
      this.shouldContinueWithJourney = await this.service.finish(false);
      await this.service.SaveAccidentDamage(this.yourVehicleDamage);
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

    const hasDamageCaptures =
      this.damageCaptures.filter(x => x.Base64).length > 0;
    if (isEverythingSet) {
      isEverythingSet = hasDamageCaptures;
    } else if (nothingSet && hasDamageCaptures) {
      nothingSet = false;
    }

    return nothingSet ? 0 : isEverythingSet ? 2 : 1;
  }

  async GetVehicleDamage() {
    var response = await this.service.GetYourVehicleDamage();
    response.subscribe(async (result: any) => {
      ////console.log(result);
      if (result.operation == "success") {
        this.yourVehicleDamage = result.data as YourVehicleDamageModel;
        var imgaeFullPath = result.data.image_full_path;
        this.damageCaptures.forEach(element => {
          switch (element.Title) {
            case "Front":
              element.Base64 = this.yourVehicleDamage
                .vehicle_damages_front_image
                ? imgaeFullPath +
                  this.yourVehicleDamage.vehicle_damages_front_image
                : null;
              break;
            case "Front Right":
              element.Base64 = this.yourVehicleDamage.front_right_image
                ? imgaeFullPath + this.yourVehicleDamage.front_right_image
                : null;
              break;
            case "Front Left":
              element.Base64 = this.yourVehicleDamage.front_left_image
                ? imgaeFullPath + this.yourVehicleDamage.front_left_image
                : null;
              break;
            case "Back":
              element.Base64 = this.yourVehicleDamage.back_image
                ? imgaeFullPath + this.yourVehicleDamage.back_image
                : null;
              break;
            case "Back Right":
              element.Base64 = this.yourVehicleDamage.back_right_image
                ? imgaeFullPath + this.yourVehicleDamage.back_right_image
                : null;
              break;
            case "Back Left":
              element.Base64 = this.yourVehicleDamage.back_left_image
                ? imgaeFullPath + this.yourVehicleDamage.back_left_image
                : null;
              break;
            case "Left Front":
              element.Base64 = this.yourVehicleDamage.left_front_image
                ? imgaeFullPath + this.yourVehicleDamage.left_front_image
                : null;
              break;
            case "Left Back":
              element.Base64 = this.yourVehicleDamage.left_back_image
                ? imgaeFullPath + this.yourVehicleDamage.left_back_image
                : null;
              break;
            case "Right Front":
              element.Base64 = this.yourVehicleDamage.right_front_image
                ? imgaeFullPath + this.yourVehicleDamage.right_front_image
                : null;
              break;
            case "Right Back":
              element.Base64 = this.yourVehicleDamage.right_back_image
                ? imgaeFullPath + this.yourVehicleDamage.right_back_image
                : null;
              break;

            case "Bonnet":
              element.Base64 = this.yourVehicleDamage.bonnet_image
                ? imgaeFullPath + this.yourVehicleDamage.bonnet_image
                : null;
              break;
            case "Roof":
              element.Base64 = this.yourVehicleDamage.roof_image
                ? imgaeFullPath + this.yourVehicleDamage.roof_image
                : null;
              break;
            case "Boot":
              element.Base64 = this.yourVehicleDamage.boot_image
                ? imgaeFullPath + this.yourVehicleDamage.boot_image
                : null;
              break;
            case "Multiple":
              element.Base64 = this.yourVehicleDamage.multiple_damage_image
                ? imgaeFullPath + this.yourVehicleDamage.multiple_damage_image
                : null;
              break;
            case "Caught on Fire":
              element.Base64 = this.yourVehicleDamage.caughtonfire_image
                ? imgaeFullPath + this.yourVehicleDamage.caughtonfire_image
                : null;
              break;
            case "Rolled":
              element.Base64 = this.yourVehicleDamage.rolled_image
                ? imgaeFullPath + this.yourVehicleDamage.rolled_image
                : null;
              break;
            case "Undercarrige":
              element.Base64 = this.yourVehicleDamage.under_carrige_image
                ? imgaeFullPath + this.yourVehicleDamage.under_carrige_image
                : null;
              break;
            case "No Detail":
              element.Base64 = this.yourVehicleDamage.no_details_image
                ? imgaeFullPath + this.yourVehicleDamage.no_details_image
                : null;
              break;
            case "No Damage":
              element.Base64 = this.yourVehicleDamage.no_damage_image
                ? imgaeFullPath + this.yourVehicleDamage.no_damage_image
                : null;
              break;
            case "Windscreen / Window":
              element.Base64 = this.yourVehicleDamage.windoworwindscreen_image
                ? imgaeFullPath +
                  this.yourVehicleDamage.windoworwindscreen_image
                : null;
              break;
          }
        });

        this.ReloadOptions();
      }
    });
    this.ReloadOptions();
  }

  async ReloadOptions() {
    this.vehicleTypeOptions = await this.service.getSliderOptions(
      "vehicleTypeOptions",
      Number(this.yourVehicleDamage.vehicle_type)
    );
    this.flatOrSlopedRoadOptions = await this.service.getSliderOptions(
      "flatOrSlopedRoadOptions",
      Number(this.yourVehicleDamage.road_road_flatorsloped)
    );

    this.positionBeforeAccident = await this.service.getSliderOptions(
      "positionBeforeAccident",
      Number(this.yourVehicleDamage.vehicle_position_before_accident)
    );
    this.whatDriverWasDoingOptions = await this.service.getSliderOptions(
      "whatDriverWasDoingOptions",
      Number(this.yourVehicleDamage.you_doing)
    );

    this.directionVehicleWasTravellingOptions =
      await this.service.getSliderOptions(
        "directionVehicleWasTravellingOptions",
        Number(this.yourVehicleDamage.vehicle_direction)
      );
    this.conditionOfReflectorsOptions = await this.service.getSliderOptions(
      "conditionOfReflectorsOptions",
      Number(this.yourVehicleDamage.cond_veh_reflector)
    );
    this.conditionOfVehicleLights = await this.service.getSliderOptions(
      "conditionOfVehicleLights",
      Number(this.yourVehicleDamage.cond_vehicle_light)
    );
  }
}
