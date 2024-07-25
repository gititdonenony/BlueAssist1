import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  options = {
    maximumImagesCount: 4,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    quality: 70,
    correctOrientation: true,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    toBack: true,
    height: 10
  };
  img: string;
  constructor(private camera: Camera,) { }
  openCamera(): Promise < any > {
    let promise: Promise < any > = new Promise(async (resolve, reject) => {
      const options: CameraOptions = {
        quality: 90, // picture quality
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 720,
        cameraDirection: this.camera.Direction.BACK,
        correctOrientation: true
      };
      this.setCameraImageToPath(options).then(data => {
        console.log(data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    });
    return promise;
  }

  setCameraImageToPath(options): Promise < any > {
    let promise: Promise < any > = new Promise(async (resolve, reject) => {
      this.camera.getPicture(options).then((imageData) => {
        this.img = 'data:image/jpeg;base64,' + imageData;
        console.log(this.img)
        resolve(this.img)
      }, (error) => {
        console.log(error);
        reject(error)
      });
    });
    return promise;
  }

  chooseimage(): Promise < any > {
    let promise: Promise < any > = new Promise(async (resolve, reject) => {
    this.camera.getPicture(this.options).then((imageData) => {
    this.img = 'data:image/jpeg;base64,' + imageData;
    resolve(this.img)
      }, (error) => {
      //  this.dismissLoader();
        console.log(error);
        reject(error)
      });
    });
    return promise;
  }
}
