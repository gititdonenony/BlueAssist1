import { Component, NgZone, isDevMode } from '@angular/core';

import { NavController } from '@ionic/angular';

import { MessageBusService } from '../../services/messagebus.service';
import { ICameraCaptureInfo } from '../../services/models.service';
import { GlobalService } from '../../services/global.service';
import { LoggerService } from '../../services/logger.service';

import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';


// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-camera-capture',
  templateUrl: './camera-capture.page.html',
  styleUrls: ['./camera-capture.page.scss'],
  animations: [
    trigger('rotate', [
      state('landscape', style({ transform: 'rotate(90deg)' })),
      state('portrait', style({ transform: 'rotate(0deg)' })),
      transition('landscape <=> portrait', [
        animate(200)
      ])
    ])
  ]
})
export class CameraCapturePage {

  cameraStarted = false;
  flashOn = false;
  lottieConfig = {
    path: 'assets/lottie/turn-phone.json',
    renderer: 'canvas',
    autoplay: true,
    loop: true
  };
  correctOrientation = false;

  isGalleryUpload = false;
  imageResponse: any;

  resultsToReturn: ICameraCaptureInfo;
  storageKey: string;

  constructor(private camera: CameraPreview,
              private nav: NavController,
              private messageBus: MessageBusService,
              private ngZone: NgZone,
              private file: File,
              private global: GlobalService,
              private cameraPicker: Camera,
              private logger: LoggerService) { }

  async ionViewDidEnter() {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      this.storageKey = searchParams.get('storageKey');
      if (searchParams.get('gallery') !== 'true') {
        this.isGalleryUpload = false;
        try {
          await this.camera.startCamera({
            alpha: 1,
            camera: 'rear',
            disableExifHeaderStripping: true,
            tapPhoto: false,
            tapFocus: true,
            toBack: true
          });
        } catch (err) {
          this.logger.error('CameraCapturePage::ionViewDidEnter::startCamera', err);
          if (err !== 'Camera already started' && !isDevMode()) {
            await this.goBack();
            return;
          } else {
            const sleep = () => {
              return new Promise((resolve) => { setTimeout(() => { resolve(''); }, 500); });
            };
            await sleep();
          }
        }

        await this.camera.show();

        this.cameraStarted = true;

        this.monitorDeviceOrientation(false);
      } else {
        this.isGalleryUpload = true;
        this.openImagePicker();
      }
    } catch (err) {
      this.logger.error('CameraCapturePage::ionViewDidEnter', err);
      this.goBack();
    }
  }

  async goBack() {
    this.cameraStarted = false;
    await this.nav.pop();
  }

  private async openImagePicker() {
    try {

      // const image = await Camera.getPhoto({
      //   quality: 30,
      //   allowEditing: false,
      //   resultType: CameraResultType.Base64,
      //   source: CameraSource.Prompt,
      //   saveToGallery: false,
      // });
      // const body = {
      //   imageFile: image.base64String.toString(),
      //   imageType: image.format,
      // };

      const cameraOptions: CameraOptions = {
        allowEdit: false,
        cameraDirection: this.cameraPicker.Direction.BACK,
        correctOrientation: true,
        destinationType: this.cameraPicker.DestinationType.DATA_URL,
        mediaType: this.cameraPicker.MediaType.PICTURE,
        quality: 85,
        saveToPhotoAlbum: false,
        sourceType: this.cameraPicker.PictureSourceType.PHOTOLIBRARY,
        encodingType: this.cameraPicker.EncodingType.JPEG
      };
      const result = await this.cameraPicker.getPicture(cameraOptions);

     

       console.log('result~~~~~~~~~~~~~~~~~~~~~',result)





      await this.saveImage(this.global.cleanBase(result), 'Gallery');
      await this.goBack();
    } catch (err) {
      this.logger.error('CameraCapturePage::openImagePicker', err);
      if (isDevMode()) {
        this.fallbackImagePicker();
      } else {
        await this.goBack();
      }
    }
  }

  private fallbackImagePicker() {
    try {
      const fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      fileInput.setAttribute('accept', 'image/*');
      fileInput.onchange = () => {
        try {
          const file = fileInput.files[0];
          console.log(file);
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            (async () => {
              await this.saveImage(this.global.cleanBase((reader.result as string)), 'Gallery');
              await this.goBack();
            })();
          };
        } catch (err) {
          this.logger.error('CameraCapturePage::fallbackImagePicker::onchange', err);
          this.goBack();
        }
      };
      fileInput.click();
    } catch (err) {
      this.logger.error('CameraCapturePage::fallbackImagePicker', err);
      this.goBack();
    }
  }

  async ionViewWillLeave() {
    this.messageBus.sendCameraCaptureInfo(this.resultsToReturn);
    if (!this.isGalleryUpload) {
      this.monitorDeviceOrientation(true);
    }
    try {
      await this.camera.hide();
      await this.camera.stopCamera();
    } catch (err) {
      this.logger.error('CameraCapturePage::ionViewWillLeave', err);
    }
  }

  private async requestDeviceOrientation(): Promise<boolean> {
    const sleep = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('');
        }, 500);
      });
    };
    let didGetAnswer = false;
    let hasPermission: boolean = null;
    while (!didGetAnswer) {
      try {
        const permissionResult = await DeviceOrientationEvent['requestPermission']();
        if (permissionResult === 'granted') {
          hasPermission = true;
          didGetAnswer = true;
        } else if (permissionResult === 'denied') {
          hasPermission = false;
          didGetAnswer = true;
        } else {
          await sleep();
        }
      } catch (err) {
        this.logger.error('CameraCapturePage::requestDeviceOrientation', err);
        didGetAnswer = true;
      }
    }

    if (hasPermission === false) {
      return false;
    } else if (hasPermission === true) {
      return true;
    }
  }

  private async monitorDeviceOrientation(isClose: boolean) {
    try {
      if (typeof DeviceOrientationEvent['requestPermission'] === 'function') {
        const hasPermission = await this.requestDeviceOrientation();
        if (!hasPermission) {
          await this.global.toast('We need this permission to use the camera. Please allow this permission');
          await this.goBack();
        }
      }
      const watcher = (event: DeviceOrientationEvent) => {
        const dirDegrees = event.beta;
        this.ngZone.run(() => {
          if (dirDegrees < 15 && dirDegrees > -15 ||
            dirDegrees > 165 && dirDegrees <= 180 ||
            dirDegrees < -165 && dirDegrees >= -180) {
            this.correctOrientation = true;
          } else {
            this.correctOrientation = false;
          }
        });
      };
      if (!isClose) {
        window.addEventListener('deviceorientation', (event) => {
          watcher(event);
        }, true);
      } else {
        window.removeEventListener('deviceorientation', (event) => {
          watcher(event);
        }, true);
      }
    } catch (err) {
      this.logger.error(`CameraCapturePage::monitorDeviceOrientation?${isClose}`, err);
    }
  }

  async toggleFlash() {
    try {
      const currentFlashMode = await this.camera.getFlashMode();
      if (currentFlashMode === 'off') {
        await this.camera.setFlashMode('on');
        this.flashOn = true;
      } else {
        await this.camera.setFlashMode('off');
        this.flashOn = false;
      }
    } catch (err) {
      this.logger.error('CameraCapturePage::toggleFlash', err);
    }
  }

  async tapFocus(tapEvent) {
    try {
      await this.camera.tapToFocus(tapEvent.center.x, tapEvent.center.y);
    } catch (err) {
      this.logger.error('CameraCapturePage::tapFocus', err);
    }
  }

  async takePicture() {
    try {
      const picture = await this.camera.takePicture({
        quality: 85,
        height: window.innerWidth,
        width: window.innerHeight
      });
      if (picture) {
        this.cameraStarted = false;
        setTimeout(async () => {
          await this.saveImage(picture, 'Camera');
          await this.goBack();
        });
      }
    } catch (err) {
      this.logger.error('CameraCapturePage::takePicture', err);
    }
  }

  private async saveImage(base64: string, source: string) {
    try {
      const createGUID = () => {
        return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          return Math.ceil(Math.random() * 9).toString();
        });
      };

      const thumbnailBase64 = await this.generateThumbnail(`data:image/jpeg;base64,${base64}`);

      const fileName = `${createGUID()}.jpg`;

      this.resultsToReturn = {
        Base64: thumbnailBase64,
        Directory: this.file.dataDirectory,
        FileName: fileName,
        FullPath: `${this.file.dataDirectory}${fileName}`,
        ImageSource: source,
        ThumbnailDirectory: `${this.file.dataDirectory}thumbnails/`
      };

      try {
        const base64toBlob = (b64Data) => {
          const sliceSize = 512;
          const byteCharacters = atob(b64Data);
          const byteArrays = [];
          for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }
          const blob = new Blob(byteArrays, {
            type: 'image/jpeg'
          });
          return blob;
        };

        const writeStatus = await this.file.writeFile(this.resultsToReturn.Directory,
          this.resultsToReturn.FileName,
          base64toBlob(base64));
        console.log(writeStatus);

        let thumbDirExists = false;
        try {
          thumbDirExists = await this.file.checkDir(this.file.dataDirectory, 'thumbnails');
        } catch (err) {
          console.log(err);
        }
        if (!thumbDirExists) {
          await this.file.createDir(this.file.dataDirectory, 'thumbnails', false);
        }

        const thumbWriteStatus = await this.file.writeFile(this.resultsToReturn.ThumbnailDirectory,
          this.resultsToReturn.FileName,
          base64toBlob(this.global.cleanBase(thumbnailBase64)));
        console.log(thumbWriteStatus);

        this.messageBus.emitImageSavedEvent({
          CaptureInfo: this.resultsToReturn,
          StorageKey: this.storageKey
        });
      } catch (err) {
        this.logger.error('CameraCapturePage::saveImage::Task', err);
      }
    } catch (err) {
      this.logger.error('CameraCapturePage::saveImage', err);
    }
  }

  private generateThumbnail(base64: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        try {
          const canvas: HTMLCanvasElement = document.createElement('canvas');

          canvas.width = img.naturalWidth * 0.3;
          canvas.height = img.naturalHeight * 0.3;

          const ctx = canvas.getContext('2d');

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL('image/jpeg', 0.5));
        } catch (err) {
          this.logger.error('CameraCapturePage::generateThumbnail::onload', err);
          resolve('');
        }
      };
      img.src = base64;
    });
  }
}
