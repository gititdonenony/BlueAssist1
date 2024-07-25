import { ScannerService } from "./../../../../services/scanner.service";
import { PdfDownloaderService } from "src/app/services/pdf-downloader.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { IonSlides, ModalController } from "@ionic/angular";

import { AccidentSceneService, PageAnimations } from "./accident-scene.service";

import { IIconRadioOption } from "../../../../services/models.service";
import { AccidentSceneModel } from "src/app/pages/tabs/Model/claim.model";
import { ClaimService } from "src/app/services/claim.service";
import { Storage } from "@ionic/storage";
import { CameraCapacitorService } from "src/app/services/camera-capacitor.service";
import { ARformPhotoGalleryComponent } from "src/app/component/arform-photo-gallery/arform-photo-gallery.component";
import { MessageService } from "src/app/services/message.service";
@Component({
  selector: "app-accident-scene",
  templateUrl: "./accident-scene.page.html",
  styleUrls: ["./accident-scene.page.scss"],
  animations: PageAnimations,
  providers: [AccidentSceneService],
})
export class AccidentScenePage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true,
  };
  totalSlides = 0;

  shouldContinueWithJourney = false;

  frontImage = "";
  rightImage = "";
  backImage = "";
  leftImage = "";

  descriptionOfAccident = "";
  accidentSceneModel: AccidentSceneModel;
  accidentTypeOptions: IIconRadioOption[];

  @ViewChild("slider", { static: true }) slider: IonSlides;

  constructor(
    private service: AccidentSceneService,
    private claimService: ClaimService,
    private storage: Storage,
    private pdfService: PdfDownloaderService,
    private scannerService: ScannerService,
    private cameraCapacitorService: CameraCapacitorService,
    private modalCtrl: ModalController,
    private messageService: MessageService
  ) {
    this.accidentSceneModel = new AccidentSceneModel();
    this.GetOtherDriverInfo();
  }

  async ngOnInit() {
    this.totalSlides = await this.slider.length();
  }

  ionViewWillLeave() {
    const state = this.calculateState();
    this.service.broadcastState(state, this.shouldContinueWithJourney);
  }

  async captureImage(side: string) {
  
    const popover = await this.modalCtrl.create({
      component: ARformPhotoGalleryComponent,
      cssClass: 'login-unlock-modal-class-d',
    });
    await popover.present();
    const img = await popover.onDidDismiss();
    
    console.log('img++++++  ts  ++++++++',img);
    
    if (img?.data.mode === 'camera' && img.data.FileName !== "") {
         
      this.postImageUplaod(side, img);
          
    }
    else if (img?.data.mode === 'gallery' && img.data.FileName !== "" && (img.data.imageType === 'jpeg' || img.data.imageType === 'jpg' || img.data.imageType === 'png')) {
    
      this.postImageUplaod(side, img);
    }
    else if (img?.data.mode === 'gallery' && img.data.FileName !== "" && (img.data.imageType !== 'jpeg' || img.data.imageType !== 'jpg' || img.data.imageType !== 'png')) {
      this.messageService.presentErrorToast("Only images can be uplaod.")
    }
    else{
      this.messageService.presentErrorToast("somthing went wrong!!! PLease try again.")
    }

  }



 async postImageUplaod(side: any, img: any){

  console.log('img++++++  ts  ++++++++',img);

    switch (side) {
      case "Front":
        this.frontImage = `${img.data.Base64}`;
        break;
        case "Right":
        this.rightImage = `${img.data.Base64}`;
        break;
      case "Back":
        this.backImage = `${img.data.Base64}`;
        break;
      case "Left":
        this.leftImage = `${img.data.Base64}`;
        break;
      }
 

    let response = await this.service.saveImage(side, img.data);

    response.subscribe((result: any) => {

      console.log('result^^^^^^Accident-scene-page^^^^^^^',result);
      
      this.rightImage1 = result.data.imagepath;
      console.log(this.rightImage1);
      if (result.operation == "success") {
        switch (side) {
          case "Front":
            this.accidentSceneModel.front_image = result.data.imagename;
            this.frontImage = result.data.imagepath;
            console.log('result.data.imagepath^^^^^^Accident-scene-page^^^^^^^',result.data.imagepath);
            break;
          case "Right":
            this.accidentSceneModel.right_image = result.data.imagename;
            this.rightImage = result.data.imagepath;
            break;
          case "Back":
            this.accidentSceneModel.back_image = result.data.imagename;
            this.backImage = result.data.imagepath;
            break;
          case "Left":
            this.accidentSceneModel.left_image = result.data.imagename;
            this.leftImage = result.data.imagepath;
            break;
        }
      }
    });
  }












  public rightImage1: string = "";

  async adjustSlideHeight() {
    await this.slider.updateAutoHeight();
  }

  async saveChanges() {
    this.accidentSceneModel.description = this.descriptionOfAccident;
    console.log(this.accidentSceneModel);
    await this.service.SaveAccidentScene(this.accidentSceneModel);
    //await this.service.saveFormChanges(this.descriptionOfAccident);
  }

  async saveAccidentType(option: IIconRadioOption) {
    //console.log(option);
    this.accidentSceneModel.type = option.ID.toString();
    //await this.service.saveAccidentType(option.ID);
  }

  async backClicked() {
    const currentIndex = await this.slider.getActiveIndex();
    //console.log(currentIndex,"Current Index")
    if (currentIndex === 0) {
      await this.service.finish(true);
    } else {
      await this.slider.slidePrev();
    }
  }

  async nextClicked() {
    const currentIndex = await this.slider.getActiveIndex();
    if (currentIndex + 1 < this.totalSlides) {
      await this.slider.slideNext();
    } else {
      this.shouldContinueWithJourney = await this.service.finish(false);
    }
  }

  private calculateState() {
    if (
      !this.frontImage &&
      !this.backImage &&
      !this.leftImage &&
      !this.rightImage &&
      !this.descriptionOfAccident &&
      this.accidentTypeOptions.filter(x => x.Selected).length === 0
    ) {
      return 0;
    } else if (
      !this.frontImage ||
      !this.backImage ||
      !this.leftImage ||
      !this.rightImage ||
      (!this.descriptionOfAccident &&
        this.accidentTypeOptions.filter(x => x.Selected).length === 0)
    ) {
      return 1;
    }
    return 2;
  }

  async GetOtherDriverInfo() {
    console.log("mama mia from GetOtherDriverInfo");
    var response = await this.service.GetAccidentScene();
    response.subscribe(async (result: any) => {
      //console.log(result);
      if (result.operation == "success") {
        this.accidentSceneModel = result.data as AccidentSceneModel;
        var imgaeFullPath = result.data.image_full_path;
        this.frontImage = imgaeFullPath + this.accidentSceneModel.front_image;

        this.rightImage = imgaeFullPath + this.accidentSceneModel.right_image;
        this.backImage = imgaeFullPath + this.accidentSceneModel.back_image;

        this.leftImage = imgaeFullPath + this.accidentSceneModel.left_image;
        this.descriptionOfAccident = this.accidentSceneModel.description;
      }
      (async () => {
        const data = await this.service.SetAccidentType(
          Number(this.accidentSceneModel.type)
        );
        this.accidentTypeOptions = data;
      })();
    });
  }
}
