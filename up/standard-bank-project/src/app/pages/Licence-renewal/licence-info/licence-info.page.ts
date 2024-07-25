
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { ApiService } from 'src/app/services/api.service';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from "@ionic/angular";
import { PhotogalleryComponent } from 'src/app/component/photogallery/photogallery.component';

@Component({
  selector: 'app-licence-info',
  templateUrl: './licence-info.page.html',
  styleUrls: ['./licence-info.page.scss'],
})
export class LicenceInfoPage implements OnInit {
  licenceFrom: FormGroup;
  userObject: any;
  getVData: any;
  vehicleId: any;
  vehicleMake: any;
  token: any;
  vehicle_id: any;
  vehicle_year: any;
  vehicle_model: any;
  expiryYear: number;
  baskets: any[] = [];
  isAllFilled = false;

  constructor(
    private alertCtrl: AlertController,
    private route: Router,
    private location: Location,
    private fb: FormBuilder,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private actionSheetCtrl: ActionSheetController,
    public loadingController: LoadingController,
    private modalCtrl: ModalController
  ) { }
  ngOnInit() {
    this.myForm();
    this.vehicleId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.token = this.userObject.token;
    }
    this.getBaskets();
  }
  myForm() {
    this.licenceFrom = this.fb.group({
      registration: [{ disabled: true }],
      vType: ['', Validators.required],
      tare: ['', Validators.required],
      dAddress: ['', Validators.required],
    });
  }
  goBack() {
    this.location.back();
  }
  delivery() {
    this.route.navigate(['/delivery-address']);
  }

  async getBaskets() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass: 'my-custom-class',
    });
    await loading.present();
    this.apiService
      .allBasket(this.token)
      .pipe(finalize(async () => await loading.dismiss()))
      .subscribe((res: any) => {
        if (res.operation === 'success') {
          localStorage.setItem('cart_id', res.data.basket[0].cart_id);
          this.baskets = res.data.basket;
          this.baskets.map((element) => {
            if (
              element.item_proof_of_residence &&
              element.item_copy_id &&
              element.item_current_disc
            ) {
              this.isAllFilled = true;
            } else {
              this.isAllFilled = false;
            }
          });
        }
      });
  }

  async presentActionSheet(data) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure ?',
      subHeader: 'Item will be deleted permanently',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          data: {
            action: 'delete',
          },
          handler: () => {
            this.removeItem(data);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
  }
  async removeItem(data) {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass: 'my-custom-class',
      message: 'Deleting...',
    });
    await loading.present();
    this.apiService
      .deleteItemLicenceRenewel(data.item_id, this.token)
      .pipe(finalize(async () => await loading.dismiss()))
      .subscribe((res: any) => {
        if (res.operation === 'success') {
          this.baskets = res.data.basket;
          this.baskets.map((element) => {
            if (
              element.item_proof_of_residence &&
              element.item_copy_id &&
              element.item_current_disc
            ) {
              this.isAllFilled = true;
            } else {
              this.isAllFilled = false;
            }
          });
          this.messageService.presentSuccessToast('Deleted Successfully');
        } else {
          this.messageService.presentErrorToastWithDuration(
            'Something went wrong',
            2000,
            'danger'
          );
        }
      });
  }

  async uploadImg(txt, v) {
    const alert = await this.alertCtrl.create({
      header: 'Upload Photo',
      // message: 'Choose an option',
      buttons: [
        {
          text: 'Take Photo',
          handler: () => {
            this.openCamera(txt, v); // Call method to choose from gallery
          }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {
            this.gallery(txt, v); // Call method to choose from gallery
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Handle cancel action
          }
        }
      ]
    });

    await alert.present();

  }
  async openCamera(txt, v) {
    const popover = await this.modalCtrl.create({
      component: PhotogalleryComponent,
      cssClass: 'login-unlock-modal-class-d',
    });
    await popover.present();
    const image = await popover.onDidDismiss();
    if (image.data.mode === "undefined") {
      this.messageService.presentErrorToast("Please try again.")
    }
    else if (image.data.mode === 'camera' && image.data.imageFile !== "") {
      const body = {
        imageFile: image.data.imageFile,
        imageType: image.data.imageType,
      };
      this.postImageUplaodCamera(body, txt, v)
    }
    else if (image.data.mode === 'gallery' && image.data.imageFile !== "" && (image.data.imageType === 'jpeg' || image.data.imageType === 'jpg' || image.data.imageType === 'png')) {
      const body = {
        imageFile: image.data.imageFile,
        imageType: image.data.imageType,
      };
      this.postImageUplaodCamera(body, txt, v)
    }
    else if (image.data.mode === 'gallery' && image.data.imageFile !== "" && (image.data.imageType !== 'jpeg' || image.data.imageType !== 'jpg' || image.data.imageType !== 'png')) {
      this.messageService.presentErrorToast("Only images can be uplaod.")
    } else {
      this.messageService.presentErrorToast("somthing went wrong!!! PLease try again.")
    }
    console.log(image.data.mode);
    console.log(image.data.imageFile);
    console.log(image.data.imageType);


  }


  async postImageUplaodCamera(body, txt, v) {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass: 'my-custom-class',
      message: 'Uploading...',
    });
    await loading.present();
    let imgUrl;
    this.apiService.imageBase64Upload(body, this.token).subscribe(
      (res: any) => {
        const imgName = res.data.imagename;
        imgUrl = res.data.imagepath;
        const uploadPayload = {
          fileName: imgName,
          type: txt,
        };
        this.apiService
          .itemUploadDocument(uploadPayload, this.token, v)
          .pipe(finalize(async () => await loading.dismiss()))
          .subscribe(
            (resp) => {
              switch (txt) {
                case 'ProofOfResidence':
                  v.item_proof_of_residence = imgName;
                  break;
                case 'CopyOfID':
                  v.item_copy_id = imgName;
                  break;
                case 'CurrentDisc':
                  v.item_current_disc = imgName;
                  break;

                default:
                  v.item_proof_of_residence = imgName;
                  break;
              }
              this.baskets.map((element) => {
                if (
                  element.item_proof_of_residence &&
                  element.item_copy_id &&
                  element.item_current_disc
                ) {
                  this.isAllFilled = true;
                } else {
                  this.isAllFilled = false;
                }
              });
            },
            (errr) => console.log(errr)
          );
      },
      (err) => console.log(err)
    );
  }

  async gallery(txt, v) {
    const popover = await this.modalCtrl.create({
      component: PhotogalleryComponent,
      cssClass: 'login-unlock-modal-class-d',
    });
    await popover.present();
    const image = await popover.onDidDismiss();
    if (image.data.mode === "undefined") {
      this.messageService.presentErrorToast("Please try again.")
    }
    else if (image.data.mode === 'camera' && image.data.imageFile !== "") {
      const body = {
        imageFile: image.data.imageFile,
        imageType: image.data.imageType,
      };
      this.postImageUplaodGallery(body, txt, v)
    }
    else if (image.data.mode === 'gallery' && image.data.imageFile !== "" && (image.data.imageType === 'jpeg' || image.data.imageType === 'jpg' || image.data.imageType === 'png')) {
      const body = {
        imageFile: image.data.imageFile,
        imageType: image.data.imageType,
      };
      this.postImageUplaodGallery(body, txt, v)
    }
    else if (image.data.mode === 'gallery' && image.data.imageFile !== "" && (image.data.imageType !== 'jpeg' || image.data.imageType !== 'jpg' || image.data.imageType !== 'png')) {
      this.messageService.presentErrorToast("Only images can be uplaod.")
    } else {
      this.messageService.presentErrorToast("somthing went wrong!!! PLease try again.")
    }
    console.log(image.data.mode);
    console.log(image.data.imageFile);
    console.log(image.data.imageType);

  }


  async postImageUplaodGallery(body, txt, v) {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass: 'my-custom-class',
      message: 'Uploading...',
    });
    await loading.present();
    let imgUrl;
    this.apiService.imageBase64Upload(body, this.token).subscribe(
      (res: any) => {
        const imgName = res.data.imagename;
        imgUrl = res.data.imagepath;
        const uploadPayload = {
          fileName: imgName,
          type: txt,
        };
        this.apiService
          .itemUploadDocument(uploadPayload, this.token, v)
          .pipe(finalize(async () => await loading.dismiss()))
          .subscribe(
            (resp) => {
              switch (txt) {
                case 'ProofOfResidence':
                  v.item_proof_of_residence = imgName;
                  break;
                case 'CopyOfID':
                  v.item_copy_id = imgName;
                  break;
                case 'CurrentDisc':
                  v.item_current_disc = imgName;
                  break;

                default:
                  v.item_proof_of_residence = imgName;
                  break;
              }
              this.baskets.map((element) => {
                if (
                  element.item_proof_of_residence &&
                  element.item_copy_id &&
                  element.item_current_disc
                ) {
                  this.isAllFilled = true;
                } else {
                  this.isAllFilled = false;
                }
              });
            },
            (errr) => console.log(errr)
          );
      },
      (err) => console.log(err)
    );
  }
}
