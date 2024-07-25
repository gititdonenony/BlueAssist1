/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MessageService } from 'src/app/services/message.service';
import { AlertController, ModalController } from "@ionic/angular";
import { Router } from '@angular/router';
import { PhotogalleryComponent } from 'src/app/component/photogallery/photogallery.component';
// import { FileChooser } from '@ionic-native/file-chooser/ngx';

@Component({
  selector: 'app-upload-docs',
  templateUrl: './upload-docs.page.html',
  styleUrls: ['./upload-docs.page.scss'],
})
export class UploadDocsPage implements OnInit {
  [x: string]: any;
  checked = false;
  token: any;
  imageOne: any;
  imageTwo: any;
  imageThree: any;
  image1: any;
  image2: any;
  image3: any;

  rafNum: any
  constructor(
    private loaderService: LoaderService,
    private apiService: ApiService,
    private messageService: MessageService,
    private alertCtrl: AlertController,
    private route: Router,
    private modalCtrl:ModalController
  ) {
    this.token = JSON.parse(localStorage.getItem('userLoginData')).token;
  }

  ngOnInit() { }

  addValue(e): void {
    const isChecked = e.currentTarget.checked;
  }
  async captureImage(index) {
    const alert = await this.alertCtrl.create({
      header: 'Upload Photo',
      // message: 'Choose an option',
      buttons: [
        {
          text: 'Take Photo',
          handler: () => {
            this.openCamera(index); // Call method to choose from gallery
          }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {
            this.gallery(index); // Call method to choose from gallery
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
  // async openCamera(index) {
  //   const image = await Camera.getPhoto({
  //     quality: 30,
  //     allowEditing: false,
  //     resultType: CameraResultType.Base64,
  //     source: CameraSource.Camera,
  //     saveToGallery: false,
  //   });
  //   const body = {
  //     imageFile: image.base64String.toString(),
  //     imageType: image.format,
  //   };
  //   this.loaderService.showLoader();
  //   this.apiService.imageBase64Upload(body, this.token).subscribe(
  //     (data: any) => {
  //       this.loaderService.hideLoader();
  //       const imgData = {
  //         name: data.data.imagename,
  //         url: data.data.imagepath,
  //       };
  //       switch (index) {
  //         case 'one':
  //           this.imageOne = imgData;
  //           localStorage.setItem(
  //             'roadcover_image_one',
  //             JSON.stringify(this.imageOne)
  //           );
  //           break;
  //         case 'two':
  //           this.imageTwo = imgData;
  //           localStorage.setItem(
  //             'roadcover_image_two',
  //             JSON.stringify(this.imageTwo)
  //           );
  //           break;
  //         case 'three':
  //           this.imageThree = imgData;
  //           localStorage.setItem(
  //             'roadcover_image_three',
  //             JSON.stringify(this.imageThree)
  //           );
  //           break;
  //         default:
  //           this.imageOne = imgData;
  //           localStorage.setItem(
  //             'roadcover_image_one',
  //             JSON.stringify(this.imageOne)
  //           );
  //           break;
  //       }
  //     },
  //     (err) => {
  //       this.loaderService.hideLoader();
  //       if (err.hasOwnProperty('status')) {
  //         if (err.status === '401') {
  //           this.messageService.presentErrorToast('Something Wrong');
  //         }
  //       }
  //     }
  //   );
  // }
  // async gallery(index) {
  //   const image = await Camera.getPhoto({
  //     quality: 30,
  //     allowEditing: false,
  //     resultType: CameraResultType.Base64,
  //     source: CameraSource.Photos,
  //     saveToGallery: false,
  //   });
  //   console.log(image);
  //   const body = {
  //     imageFile: image.base64String.toString(),
  //     imageType: image.format,
  //   };
  //   this.loaderService.showLoader();
  //   this.apiService
  //     .imageBase64Upload(body, this.token)
  //     .subscribe((data: any) => {
  //       this.loaderService.hideLoader();
  //       const imgData = {
  //         name: data.data.imagename,
  //         url: data.data.imagepath,
  //       }
  //       switch (index) {
  //         case 'one':
  //           this.imageOne = imgData;
  //           localStorage.setItem(
  //             'roadcover_image_one',
  //             JSON.stringify(this.imageOne)
  //           );
  //           break;
  //         case 'two':
  //           this.imageTwo = imgData;
  //           localStorage.setItem(
  //             'roadcover_image_two',
  //             JSON.stringify(this.imageTwo)
  //           );
  //           break;
  //         case 'three':
  //           this.imageThree = imgData;
  //           localStorage.setItem(
  //             'roadcover_image_three',
  //             JSON.stringify(this.imageThree)
  //           );
  //           break;
  //         default:
  //           this.imageOne = imgData;
  //           localStorage.setItem(
  //             'roadcover_image_one',
  //             JSON.stringify(this.imageOne)
  //           );
  //           break;
  //       }
  //     });

  // }

  async openCamera(index) {
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
      this.postImageUplaodCamera(body, index)
    }
    else if (image.data.mode === 'gallery' && image.data.imageFile !== "" && (image.data.imageType === 'jpeg' || image.data.imageType === 'jpg' || image.data.imageType === 'png')) {
      const body = {
        imageFile: image.data.imageFile,
        imageType: image.data.imageType,
      };
      this.postImageUplaodCamera(body, index)
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


  postImageUplaodCamera(body, index) {
    this.loaderService.showLoader();
    this.apiService.imageBase64Upload(body, this.token).subscribe(
      (data: any) => {
        this.loaderService.hideLoader();
        const imgData = {
          name: data.data.imagename,
          url: data.data.imagepath,
        };
        switch (index) {
          case 'one':
            this.imageOne = imgData;
            localStorage.setItem(
              'roadcover_image_one',
              JSON.stringify(this.imageOne)
            );
            break;
          case 'two':
            this.imageTwo = imgData;
            localStorage.setItem(
              'roadcover_image_two',
              JSON.stringify(this.imageTwo)
            );
            break;
          case 'three':
            this.imageThree = imgData;
            localStorage.setItem(
              'roadcover_image_three',
              JSON.stringify(this.imageThree)
            );
            break;
          default:
            this.imageOne = imgData;
            localStorage.setItem(
              'roadcover_image_one',
              JSON.stringify(this.imageOne)
            );
            break;
        }
      },
      (err) => {
        this.loaderService.hideLoader();
        if (err.hasOwnProperty('status')) {
          if (err.status === '401') {
            this.messageService.presentErrorToast('Something Wrong');
          }
        }
      }
    );
  }

  async gallery(index) {
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
      this.postImageUplaodGallery(body, index)
    }
    else if (image.data.mode === 'gallery' && image.data.imageFile !== "" && (image.data.imageType === 'jpeg' || image.data.imageType === 'jpg' || image.data.imageType === 'png')) {
      const body = {
        imageFile: image.data.imageFile,
        imageType: image.data.imageType,
      };
      this.postImageUplaodGallery(body, index)
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


  postImageUplaodGallery(body, index) {
    this.loaderService.showLoader();
    this.apiService
      .imageBase64Upload(body, this.token)
      .subscribe((data: any) => {
        this.loaderService.hideLoader();
        const imgData = {
          name: data.data.imagename,
          url: data.data.imagepath,
        }
        switch (index) {
          case 'one':
            this.imageOne = imgData;
            localStorage.setItem(
              'roadcover_image_one',
              JSON.stringify(this.imageOne)
            );
            break;
          case 'two':
            this.imageTwo = imgData;
            localStorage.setItem(
              'roadcover_image_two',
              JSON.stringify(this.imageTwo)
            );
            break;
          case 'three':
            this.imageThree = imgData;
            localStorage.setItem(
              'roadcover_image_three',
              JSON.stringify(this.imageThree)
            );
            break;
          default:
            this.imageOne = imgData;
            localStorage.setItem(
              'roadcover_image_one',
              JSON.stringify(this.imageOne)
            );
            break;
        }
      });
  }



  async submit() {
    const imgOne = JSON.parse(localStorage.getItem('roadcover_image_one'));
    const imgTwo = JSON.parse(localStorage.getItem('roadcover_image_two'));
    const imgThree = JSON.parse(localStorage.getItem('roadcover_image_three'));
    const data = JSON.parse(localStorage.getItem('roadCover-accident'));
    const payload = new FormData();
    payload.append('rafclaim_img1', imgOne ? imgOne.name : null);
    payload.append('rafclaim_img2', imgTwo ? imgTwo.name : null);
    payload.append('rafclaim_img3', imgThree ? imgThree.name : null);

    payload.append('vehicle_id', data.vehicle_id);
    payload.append('rafclaim_where', data.place);
    payload.append('rafclaim_date', data.doi);
    payload.append('rafclaim_sapsno', data.sapsno);
    payload.append('rafclaim_whathappened', data.whatHappened);
    this.apiService.roadCoverPost(payload, data.vehicle_id).subscribe(
      (res: any) => {
        if (res.operation === 'success') {
          console.log(res.data.ref);
          this.rafNum = res.data.ref
          this.messageService.presentSuccessToast('Submitted');
          localStorage.removeItem('roadCover-accident');
          localStorage.removeItem('roadcover_image_one');
          localStorage.removeItem('roadcover_image_two');
          localStorage.removeItem('roadcover_image_three');
          this.route.navigate(['/claim-submission-success', { rafNumber: this.rafNum }]);
        } else {
          this.messageService.presentErrorToast('Something went wrong');
        }
      },
      (err: any) => {
        this.messageService.presentErrorToast(err.message);
      }
    );
  }


  onSuccess() {
    // [routerLink] = "['/']"
  }
}
