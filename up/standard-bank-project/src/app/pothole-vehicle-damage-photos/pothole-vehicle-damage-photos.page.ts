/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { PhotogalleryComponent } from '../component/photogallery/photogallery.component';

@Component({
  selector: 'app-pothole-vehicle-damage-photos',
  templateUrl: './pothole-vehicle-damage-photos.page.html',
  styleUrls: ['./pothole-vehicle-damage-photos.page.scss'],
})
export class PotholeVehicleDamagePhotosPage implements OnInit {
  userObject: any;
  token: any;
  base64ResponseForIncident: any;
  incidentImageName: any;
  incidentImage: any[] = [];
  showImage = false;
  getImageUrl: any;
  uploadedGalleryImageURL: any;
  uploadedImageName: any;
  incidentImgName = [];
  img1: any;
  img2: any;
  img3: any;
  img4: any;
  handlerMessage: string;
  imgLength: any;

  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private route: Router,
    private alertController: AlertController,
    private modalCtrl: ModalController,

  ) { }

  ngOnInit() {
    this.incidentImage = JSON.parse(localStorage.getItem('vechile_images'))
      ? JSON.parse(localStorage.getItem('vechile_images'))
      : [];
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.token = this.userObject.token;
    }
  }
  ionViewWillEnter() {
    localStorage.setItem(
      'vehicle-damage-photo-lenght',
      '' + this.incidentImage.length
    );
  }
  // async captureImage() {

  //   // localStorage.setItem('vehicle-damage-photo-lenght', '' + this.imgLength);
  //   if (this.incidentImage.length <= 3) {
  //     const image = await Camera.getPhoto({
  //       quality: 30,
  //       allowEditing: false,
  //       resultType: CameraResultType.Base64,
  //       source: CameraSource.Prompt,
  //       saveToGallery: false,
  //     });
  //     const body = {
  //       imageFile: image.base64String.toString(),
  //       imageType: image.format,
  //     };
  //     this.loaderService.showLoader();
  //     this.apiService.imageBase64Upload(body, this.token).subscribe(
  //       (data: any) => {
  //         this.loaderService.hideLoader();
  //         this.imgLength = this.incidentImage.length + 1;
  //         localStorage.setItem('vehicle-damage-photo-lenght', '' + this.imgLength);

  //         const imgData = {
  //           name: data.data.imagename,
  //           url: data.data.imagepath,
  //         };
  //         this.incidentImage.push(imgData);
  //         localStorage.setItem(
  //           'vechile_images',
  //           JSON.stringify(this.incidentImage)
  //         );
  //       },
  //       (err) => {
  //         this.loaderService.hideLoader();
  //         if (err.hasOwnProperty('status')) {
  //           if (err.status == '401') {
  //             this.messageService.presentErrorToast('Something Wrong');
  //           }
  //         }
  //       }
  //     );
  //   } else {
  //     this.messageService.presentToast('You can only select four Images');
  //   }
  // }

  async captureImage() {
    if (this.incidentImage.length <= 3) {
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
        this.postImageUplaod(body)
      }
      else if (image.data.mode === 'gallery' && image.data.imageFile !== "" && (image.data.imageType === 'jpeg' || image.data.imageType === 'jpg' || image.data.imageType === 'png')) {
        const body = {
          imageFile: image.data.imageFile,
          imageType: image.data.imageType,
        };
        this.postImageUplaod(body)
      }
      else if (image.data.mode === 'gallery' && image.data.imageFile !== "" && (image.data.imageType !== 'jpeg' || image.data.imageType !== 'jpg' || image.data.imageType !== 'png')) {
        this.messageService.presentErrorToast("Only images can be uplaod.")
      } else {
        this.messageService.presentErrorToast("somthing went wrong!!! PLease try again.")
      }
      console.log(image.data.mode);
      console.log(image.data.imageFile);
      console.log(image.data.imageType);


    } else {
      this.messageService.presentToast('You can only select four Images');
    }
  }

  postImageUplaod(body) {
    this.loaderService.showLoader();
    this.apiService.imageBase64Upload(body, this.token).subscribe(
      (data: any) => {
        this.loaderService.hideLoader();
        this.imgLength = this.incidentImage.length + 1;
        localStorage.setItem('vehicle-damage-photo-lenght', '' + this.imgLength);

        const imgData = {
          name: data.data.imagename,
          url: data.data.imagepath,
        };
        this.incidentImage.push(imgData);
        localStorage.setItem(
          'vechile_images',
          JSON.stringify(this.incidentImage)
        );
      },
      (err) => {
        this.loaderService.hideLoader();
        if (err.hasOwnProperty('status')) {
          if (err.status == '401') {
            this.messageService.presentErrorToast('Something Wrong');
          }
        }
      }
    );
  }

  getPotholeByType() {
    const id = localStorage.getItem('vechicle_damage')
      ? localStorage.getItem('vechicle_damage')
      : '';
    this.apiService.getPothole('vechicle_damage', this.token, id).subscribe(
      (res: any) => {
        if (res.hasOwnProperty('operation')) {
          if (res.operation === 'success') {
            this.showImage = true;

            const url1 = `${res.data[0].image_full_path}${res.data[0].pothole_img1}`;
            const url2 = `${res.data[0].image_full_path}${res.data[0].pothole_img2}`;
            const url3 = `${res.data[0].image_full_path}${res.data[0].pothole_img3}`;
            const url4 = `${res.data[0].image_full_path}${res.data[0].pothole_img4}`;

            this.incidentImage = [
              {
                image_url:
                  res.data[0].pothole_img1 &&
                    res.data[0].pothole_img1 !== 'undefined'
                    ? url1
                    : '',
                name: res.data[0].pothole_img1,
              },
              {
                image_url:
                  res.data[0].pothole_img2 &&
                    res.data[0].pothole_img2 !== 'undefined'
                    ? url2
                    : '',
                name: res.data[0].pothole_img2,
              },
              {
                image_url:
                  res.data[0].pothole_img3 &&
                    res.data[0].pothole_img3 !== 'undefined'
                    ? url3
                    : '',
                name: res.data[0].pothole_img3,
              },
              {
                image_url:
                  res.data[0].pothole_img4 &&
                    res.data[0].pothole_img4 !== 'undefined'
                    ? url4
                    : '',
                name: res.data[0].pothole_img4,
              },
            ];
            this.incidentImage = this.incidentImage.filter(
              (ele) => ele.image_url !== ''
            );
          }
        }
      },
      (err) => {
        if (err.hasOwnProperty('status')) {
          if (err.status == '401') {
            this.messageService.presentErrorToast('Something Wrong');
          } else {
            this.messageService.presentErrorToast('Something Wrong');
          }
        } else {
          this.messageService.presentErrorToast('Something Wrong');
        }
      }
    );
  }
  async presentAlert(index) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'Are you sure  to  remove this photo',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = 'Alert confirmed';
            this.incidentImage.splice(index, 1);
            localStorage.setItem(
              'vechile_images',
              JSON.stringify(this.incidentImage)
            );

            this.imgLength = localStorage.getItem('vechile_images');
            this.imgLength = JSON.parse(this.imgLength).length - 1;
            localStorage.setItem(
              'vehicle-damage-photo-lenght',
              '' + this.imgLength
            );
          },
        },
      ],
    });
    await alert.present();
  }

  submitIncident() {
    if (this.incidentImgName.length == 0 && this.incidentImage.length == 0) {
      this.messageService.presentErrorToast(
        'You have to click atleast one picture.'
      );
      return false;
    }
    const formData = new FormData();
    formData.append(
      'img1',
      this.incidentImage[0] ? this.incidentImage[0].name : ''
    );
    formData.append(
      'img2',
      this.incidentImage[1] ? this.incidentImage[1].name : ''
    );
    formData.append(
      'img3',
      this.incidentImage[2] ? this.incidentImage[2].name : ''
    );
    formData.append(
      'img4',
      this.incidentImage[3] ? this.incidentImage[3].name : ''
    );
    formData.append('type', 'vechicle_damage');
    localStorage.setItem(
      'vehicle-damage-scene-photos',
      JSON.stringify(this.incidentImage)
    );
    this.route.navigate(['/incident-photos']);
  }
}
