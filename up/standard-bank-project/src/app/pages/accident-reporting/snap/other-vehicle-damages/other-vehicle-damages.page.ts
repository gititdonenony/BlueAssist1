import { ClaimsClickService } from 
"./../../../../services/claims-click.service";
import { Component, OnInit, ViewChild } from "@angular/core";

import { IonSlides, ModalController } from "@ionic/angular";

import {
  OtherVehicleDamagesService,
  PageAnimations,
} from "./other-vehicle-damages.service";

import {
  IIconRadioOption,
  IDamageCapture,
} from "../../../../services/models.service";
import { OtherVehicleDamageModel } from "src/app/pages/tabs/Model/claim.model";
import { Console } from "console";
import { CameraCapacitorService } from "src/app/services/camera-capacitor.service";
import { ARformPhotoGalleryComponent } from "src/app/component/arform-photo-gallery/arform-photo-gallery.component";
import { MessageService } from "src/app/services/message.service";

@Component({
  selector: "app-other-vehicle-damages",
  templateUrl: "./other-vehicle-damages.page.html",
  styleUrls: ["./other-vehicle-damages.page.scss"],
  animations: PageAnimations,
  providers: [OtherVehicleDamagesService],
})
export class OtherVehicleDamagesPage implements OnInit {
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
    VehicleType: 93,
    VehiclePosition: 101,
    BusyDoing: 103,
    TravelDirection: 84,
    VehicleLights: 266,
    VehicleReflectors: 267,
    FlatOrSloped: 99,
  };

  @ViewChild("slider", { static: true }) slider: IonSlides;

  vehicleDamage: OtherVehicleDamageModel;

  constructor(
    private service: OtherVehicleDamagesService,
    private cameraCapacitorService: CameraCapacitorService,
    private claimClickService: ClaimsClickService,
    private modalCtrl: ModalController,
    private messageService: MessageService
  ) {
    this.vehicleDamage = new OtherVehicleDamageModel();
    this.damageCaptures = this.service.damageCaptures;
    this.service.initialize();
    this.ReloadOptions();
    this.GetTheirVehicleDamage();
  }

  async ngOnInit() {
    this.totalSlides = await this.slider.length();
  }

  async ionViewWillLeave() {
    const state = await this.calculateState();
    this.service.broadcastState(state, this.shouldContinueWithJourney);
  }

  async sliderChanged(currentIndex: number) {
    if (currentIndex === this.totalSlides - 1) {
      await this.service.showSnapPopup();
    }

    const pageDataToLoad = this.service.getSliderIndexPageMapping(currentIndex);
    if (!pageDataToLoad) {
      return;
    }

    if (pageDataToLoad !== "IMAGES" && this[pageDataToLoad].length === 0) {
      this[pageDataToLoad] = this.service.getSliderOptionsSlide(pageDataToLoad);
    } else if (pageDataToLoad === "IMAGES" && !this.alreadyFetchedImages) {
      this.alreadyFetchedImages = true;
      // this.damageCaptures = await this.service.loadSavedImages();
    }
  }


  async captureImage(capture: IDamageCapture) {
    const popover = await this.modalCtrl.create({
      component: ARformPhotoGalleryComponent,
      cssClass: 'login-unlock-modal-class-d',
    });
    await popover.present();
    const image = await popover.onDidDismiss();
  
    console.log('image++++++ ',image.data);

    
    if (image?.data.mode === 'camera' && image.data.FileName !== "") {

      capture.Base64 = `${image.data.Base64}`;

      let response = await this.service.ServerSaveImage(image.data);

      response.subscribe((result: any) => {
        // console.log(result);
        if (result.operation == "success") {
          switch (capture.Title) {
            case "Front":
              this.vehicleDamage.vehicle_damages_front_image =
                result.data.imagename;
              break;
            case "Front Right":
              this.vehicleDamage.front_right_image = result.data.imagename;
              break;
            case "Front Left":
              this.vehicleDamage.front_left_image = result.data.imagename;
              break;
            case "Back":
              this.vehicleDamage.back_image = result.data.imagename;
              break;
            case "Back Right":
              this.vehicleDamage.back_right_image = result.data.imagename;
              break;
            case "Back Left":
              this.vehicleDamage.back_left_image = result.data.imagename;
              break;
            case "Left Front":
              this.vehicleDamage.left_front_image = result.data.imagename;
              break;
            case "Left Back":
              this.vehicleDamage.left_back_image = result.data.imagename;
              break;
            case "Right Front":
              this.vehicleDamage.right_front_image = result.data.imagename;
              break;
            case "Right Back":
              this.vehicleDamage.right_back_image = result.data.imagename;
              break;

            case "Bonnet":
              this.vehicleDamage.bonnet_image = result.data.imagename;
              break;
            case "Roof":
              this.vehicleDamage.roof_image = result.data.imagename;
              break;
            case "Boot":
              this.vehicleDamage.boot_image = result.data.imagename;
              break;
            case "Multiple":
              this.vehicleDamage.multiple_damage_image = result.data.imagename;
              break;
            case "Caught on Fire":
              this.vehicleDamage.caughtonfire_image = result.data.imagename;
              break;
            case "Rolled":
              this.vehicleDamage.rolled_image = result.data.imagename;
              break;
            case "Undercarrige":
              this.vehicleDamage.under_carrige_image = result.data.imagename;
              break;
            case "No Detail":
              this.vehicleDamage.no_details_image = result.data.imagename;
              break;
            case "No Damage":
              this.vehicleDamage.no_damage_image = result.data.imagename;
              break;
            case "Windscreen / Window":
              this.vehicleDamage.windoworwindscreen_image =
                result.data.imagename;
              break;
          }
          capture.Base64 = result.data.imagepath;
        }
      });
      await this.service.saveCapturedImage(capture, image.data);
          
    }
    else if (image?.data.mode === 'gallery' && image.data.FileName !== "" && (image.data.imageType === 'jpeg' || image.data.imageType === 'jpg' || image.data.imageType === 'png')) {
      capture.Base64 = `${image.data.Base64}`;

      let response = await this.service.ServerSaveImage(image.data);

      response.subscribe((result: any) => {
        console.log(result);
        if (result.operation == "success") {
          switch (capture.Title) {
            case "Front":
              this.vehicleDamage.vehicle_damages_front_image =
                result.data.imagename;
              break;
            case "Front Right":
              this.vehicleDamage.front_right_image = result.data.imagename;
              break;
            case "Front Left":
              this.vehicleDamage.front_left_image = result.data.imagename;
              break;
            case "Back":
              this.vehicleDamage.back_image = result.data.imagename;
              break;
            case "Back Right":
              this.vehicleDamage.back_right_image = result.data.imagename;
              break;
            case "Back Left":
              this.vehicleDamage.back_left_image = result.data.imagename;
              break;
            case "Left Front":
              this.vehicleDamage.left_front_image = result.data.imagename;
              break;
            case "Left Back":
              this.vehicleDamage.left_back_image = result.data.imagename;
              break;
            case "Right Front":
              this.vehicleDamage.right_front_image = result.data.imagename;
              break;
            case "Right Back":
              this.vehicleDamage.right_back_image = result.data.imagename;
              break;

            case "Bonnet":
              this.vehicleDamage.bonnet_image = result.data.imagename;
              break;
            case "Roof":
              this.vehicleDamage.roof_image = result.data.imagename;
              break;
            case "Boot":
              this.vehicleDamage.boot_image = result.data.imagename;
              break;
            case "Multiple":
              this.vehicleDamage.multiple_damage_image = result.data.imagename;
              break;
            case "Caught on Fire":
              this.vehicleDamage.caughtonfire_image = result.data.imagename;
              break;
            case "Rolled":
              this.vehicleDamage.rolled_image = result.data.imagename;
              break;
            case "Undercarrige":
              this.vehicleDamage.under_carrige_image = result.data.imagename;
              break;
            case "No Detail":
              this.vehicleDamage.no_details_image = result.data.imagename;
              break;
            case "No Damage":
              this.vehicleDamage.no_damage_image = result.data.imagename;
              break;
            case "Windscreen / Window":
              this.vehicleDamage.windoworwindscreen_image =
                result.data.imagename;
              break;
          }
          capture.Base64 = result.data.imagepath;
        }
      });
      await this.service.saveCapturedImage(capture, image.data);
    }
    else if (image?.data.mode === 'gallery' && image.data.FileName !== "" && (image.data.imageType !== 'jpeg' || image.data.imageType !== 'jpg' || image.data.imageType !== 'png')) {
      this.messageService.presentErrorToast("Only images can be uplaod.")
    }
    else{
      this.messageService.presentErrorToast("somthing went wrong!!! PLease try again.")
    }
  }


  
 

  async saveSelection(selection: IIconRadioOption, property: string) {
    console.log(this.optionsFieldIdBinding[property]);
    if (this.optionsFieldIdBinding[property]) {
      switch (this.optionsFieldIdBinding[property]) {
        case 93:
          this.vehicleDamage.vehicle_type = selection.ID.toString();
          break;
        case 101:
          this.vehicleDamage.vehicle_position_before_accident =
            selection.ID.toString();
          break;
        case 103:
          this.vehicleDamage.they_doing = selection.ID.toString();

          break;
        case 84:
          this.vehicleDamage.vehicle_direction = selection.ID.toString();

          break;
        case 266:
          this.vehicleDamage.cond_vehicle_light = selection.ID.toString();

          break;
        case 267:
          this.vehicleDamage.cond_veh_reflector = selection.ID.toString();
          break;
        case 99:
          this.vehicleDamage.road_road_flatorsloped = selection.ID.toString();
          console.log(this.vehicleDamage.road_road_flatorsloped);
          break;
      }
      //await this.service.saveSelection(this.optionsFieldIdBinding[property], selection.ID);
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
    console.log("hji");

    const currentIndex = await this.slider.getActiveIndex();
    if (currentIndex + 1 < this.totalSlides) {
      console.log("hji678967");
      await this.slider.slideNext();
    } else {
      this.shouldContinueWithJourney = await this.service.finish(false);
      console.log(this.vehicleDamage);
      await this.service.SaveAccidentDamage(this.vehicleDamage);
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

  async GetTheirVehicleDamage() {
    console.log("I am getting called bro!")
    var response = await this.service.GetTheirVehicleDamage();
    response.subscribe(async (result: any) => {
      console.log(result);
      if (result.operation == "success") {
        this.vehicleDamage = result.data as OtherVehicleDamageModel;
        var imgaeFullPath = result.data.image_full_path;

        this.damageCaptures.forEach(element => {
          switch (element.Title) {
            case "Front":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.vehicle_damages_front_image;
              break;
            case "Front Right":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.front_right_image;
              break;
            case "Front Left":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.front_left_image;
              break;
            case "Back":
              element.Base64 = imgaeFullPath + this.vehicleDamage.back_image;
              break;
            case "Back Right":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.back_right_image;
              break;
            case "Back Left":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.back_left_image;
              break;
            case "Left Front":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.left_front_image;
              break;
            case "Left Back":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.left_back_image;
              break;
            case "Right Front":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.right_front_image;
              break;
            case "Right Back":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.right_back_image;
              break;

            case "Bonnet":
              element.Base64 = imgaeFullPath + this.vehicleDamage.bonnet_image;
              break;
            case "Roof":
              element.Base64 = imgaeFullPath + this.vehicleDamage.roof_image;
              break;
            case "Boot":
              element.Base64 = imgaeFullPath + this.vehicleDamage.boot_image;
              break;
            case "Multiple":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.multiple_damage_image;
              break;
            case "Caught on Fire":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.caughtonfire_image;
              break;
            case "Rolled":
              element.Base64 = imgaeFullPath + this.vehicleDamage.rolled_image;
              break;
            case "Undercarrige":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.under_carrige_image;
              break;
            case "No Detail":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.no_details_image;
              break;
            case "No Damage":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.no_damage_image;
              break;
            case "Windscreen / Window":
              element.Base64 =
                imgaeFullPath + this.vehicleDamage.windoworwindscreen_image;
              break;
          }
        });

        this.ReloadOptions();
      }
    });
  }

  async ReloadOptions() {
    this.vehicleTypeOptions = await this.service.getSliderOptions(
      "vehicleTypeOptions",
      Number(this.vehicleDamage.vehicle_type)
    );
    this.flatOrSlopedRoadOptions = await this.service.getSliderOptions(
      "flatOrSlopedRoadOptions",
      Number(this.vehicleDamage.road_road_flatorsloped)
    );

    this.positionBeforeAccident = await this.service.getSliderOptions(
      "positionBeforeAccident",
      Number(this.vehicleDamage.vehicle_position_before_accident)
    );
    this.whatDriverWasDoingOptions = await this.service.getSliderOptions(
      "whatDriverWasDoingOptions",
      Number(this.vehicleDamage.they_doing)
    );

    this.directionVehicleWasTravellingOptions =
      await this.service.getSliderOptions(
        "directionVehicleWasTravellingOptions",
        Number(this.vehicleDamage.vehicle_direction)
      );
    this.conditionOfReflectorsOptions = await this.service.getSliderOptions(
      "conditionOfReflectorsOptions",
      Number(this.vehicleDamage.cond_veh_reflector)
    );
    this.conditionOfVehicleLights = await this.service.getSliderOptions(
      "conditionOfVehicleLights",
      Number(this.vehicleDamage.cond_vehicle_light)
    );
  }
}
