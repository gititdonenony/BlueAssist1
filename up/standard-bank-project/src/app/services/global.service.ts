import { Injectable, isDevMode } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { File } from '@ionic-native/file/ngx';

import { ToastController, ActionSheetController, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { ActionSheetButton, AlertInput } from '@ionic/core';

import { ICameraCaptureInfo } from './models.service';
import { MessageBusService } from './messagebus.service';
import { LoggerService } from './logger.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Injectable()
export class GlobalService {
    // readonly COLOR_PRIMARY = '#3ACCE1';
    readonly COLOR_PRIMARY = '#E0E1E3';
    // tslint:disable-next-line:max-line-length
    readonly CRASH_MARKER_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA9CAMAAAApvJHbAAAAWlBMVEVHcExezN4jIyRKzuFBxtkXFxgAAADKydAEBATKy9U8zOE3vdE5x9xOwNQ7zOFAzOAAAQFHzOBdy95SzN8tanQdQUg7kp9Mvc8SKi4IFBYzeIRDorEkVFxGssNfbMIfAAAADnRSTlMAVkNFySINBjsT44GnJfSfgscAAAJvSURBVEjH7ZbrtqogEIAtVVRTB5Cr+v6vecAbiGR77f3z9NWqdPHNjKMBSfLly3/J41X33YU6a9rPblp3b3l9TNzdkaH7zKfB/fby9Du58kf2lvXTnW5u7CaUPdYa6hu7DlQtRY+9AIb0rdyeXdxrEHjl8JsE3fSsP1wx4hEwZsL3u5eR0Tt7L9KM5kaVmEs8cy9AhuIuQmm3VbwOZjOdKJs1AMhhjbDYMR0lKN3SrlDj8plz4yqwEfRs9MVGEdnaGAu+MwsxzzOAplQMS4RhtVGscGNjPINjJEQomAgh1DAzUBhnVSS5jVil9mJBDSsMgBAJjCxQE2GCzUaR1NY2qemCGS6BM5CEHDoHbuyrvqSuHhhPMFh1QYDSAIrpPcAI02YnkcofJrWi5EAB19p2S058C2ftKpLbnH3QAQYnm1ymbr210EYAEG8qt7YAGHxs2xn4jGvuU9Ptzba2hpDJkyU77GhuW/h0jFamdOYOJSHTYaOLbG3bmh1NiGSEM+XZ4jb3JLxSBd+eFS6XWiQwGrFd7hC2918st26kl54jLzco5pCeTcgMAJRm+UER9HwA92Tagq1N99eoQFGcPQ3lQn4uPR215t6zJuyhxzhi30bec2r01k4JAZji9b38Wu0g9f43qfEyzjdDsl0uAxlVDY5gZ/T9u++zZ/k81e38tnbTmhNOK0pWXuo+rv3Rx+kudjApxvUu3Ahk5bVul/5Rd/dLeKzuZFtf0Ludx9mOribhibw8ePn2zzZAnv1snJ3/zC5Kj6bf7PzH2y9UONp6tYtfbOOKpKgya+e/3gm+uiz/w0ay+bBl+0CbfPkj/wBIw1+me9gF8AAAAABJRU5ErkJggg==';
    // tslint:disable-next-line:max-line-length
    readonly CHECK_HTML = `<div class="icon-inner"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="s-ion-icon" style="min-height: 18px;min-width:18px;"><path d="M186.301 339.893L96 249.461l-32 30.507L186.301 402 448 140.506 416 110z"></path></svg></div>`;
    // tslint:disable-next-line:max-line-length
    readonly CROSS_HTML = `<div class="icon-inner"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="s-ion-icon" style="min-height: 18px;min-width:18px;"><path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path></svg></div>`;

    private win: any = window;

    constructor(private toastController: ToastController,
                private actionSheetController: ActionSheetController,
                private geolocation: Geolocation,
                private modalController: ModalController,
                private alertController: AlertController,
                private loadingController: LoadingController,
                private file: File,
                private nav: NavController,
                private messageBus: MessageBusService,
                private platform: Platform,
                private logger: LoggerService,
                private webview:WebView) {}

    async toast(msg: string): Promise<void> {
        const toast = await this.toastController.create({
            message: msg,
            animated: true,
            duration: 3500,
            mode: 'ios',
            position: 'bottom',
            color: 'dark',
            buttons: [
                { side: 'end', text: 'Close', role: 'close' }
            ]
        });
        return toast.present();
    }

    async actionSheet(title: string, actions: ActionSheetButton[]) {
        const actionSheet = await this.actionSheetController.create({
            header: title,
            animated: true,
            buttons: actions,
            backdropDismiss: true
        });
        await actionSheet.present();
    }

    async modal(componentClass: any, props?: any, extraCss?: string, disableBackdropDismiss?: boolean): Promise<HTMLIonModalElement> {
        const modal = await this.modalController.create({
            animated: true,
            component: componentClass,
            componentProps: props,
            cssClass: extraCss,
            backdropDismiss: disableBackdropDismiss ? false : true,
            swipeToClose: true
        });
        await modal.present();
        return modal;
    }

    async loading(text: string): Promise<HTMLIonLoadingElement> {
        const loadingElem: HTMLIonLoadingElement = await this.loadingController.create({
            animated: true,
            backdropDismiss: false,
            keyboardClose: false,
            message: text,
            showBackdrop: true,
            mode: 'ios',
            spinner: 'crescent'
        });
        await loadingElem.present();
        return loadingElem;
    }

    prompt(question: string, form?: AlertInput[], okText?: string, cancelText?: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const alert = await this.alertController.create({
                animated: true,
                message: question,
                inputs: form,
                buttons: [
                    {
                        text: cancelText ? cancelText : 'Cancel',
                        role: 'cancel',
                        cssClass: ['custom-button', 'cancel'],
                        handler: () => {
                            resolve(null);
                        }
                    },
                    {
                        text: okText ? okText : 'Okay',
                        cssClass: ['custom-button', 'accept'],
                        handler: (val) => {
                            if (val === undefined) {
                                val = true;
                            }
                            resolve(val);
                        }
                    }
                ],
                backdropDismiss: true
            });
            this.setPromptButtons(alert);
            await alert.present();
        });
    }
    setPromptButtons(alert: HTMLIonAlertElement) {
        const buttons = alert.querySelectorAll('.alert-wrapper > .alert-button-group > .alert-button > .alert-button-inner');
        buttons[0].innerHTML = this.CROSS_HTML;
        buttons[1].innerHTML = this.CHECK_HTML;
    }

    getLocation(): Promise<Geoposition> {
        return new Promise((resolve) => {
            try {
                this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 4000 }).then((pos: Geoposition) => {
                    resolve(pos);
                }).catch(() => {
                    this.toast('Failed to retrieve location. Please enture location is enabled on this device.');
                    resolve(null);
                });
            } catch (err) {
                console.log(err);
                resolve(null);
            }
        });
    }

    isIOS() {
        return this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone');
    }

    generateEncryptionKey(): string {
        let key = '';
        for (let i = 0; i < 4; i++) {
            key += Math.ceil(Math.random() * 9).toString();
        }
        return key;
    }

    async deletePhoto(cameraCaptureInfo: ICameraCaptureInfo): Promise<any> {
        try  {
            const doesFullExist = await this.file.checkFile(cameraCaptureInfo.Directory,
                                                            cameraCaptureInfo.FileName);

            if (doesFullExist) {
                await this.file.removeFile(cameraCaptureInfo.Directory, cameraCaptureInfo.FileName);
            }

            const doesThumbExist = await this.file.checkFile(cameraCaptureInfo.ThumbnailDirectory,
                                                            cameraCaptureInfo.FileName);

            if (doesThumbExist) {
                await this.file.removeFile(cameraCaptureInfo.ThumbnailDirectory, cameraCaptureInfo.FileName);
            }
        } catch (err) {
            this.logger.error('GlobalService::deletePhoto', err);
        }
    }

    async retrievePhoto(cameraCaptureInfo: ICameraCaptureInfo, fullImage: boolean = false): Promise<string> {
        try {
            if (!cameraCaptureInfo) {
                return '';
            }

            if (!this.platform.is('android') && isDevMode() && cameraCaptureInfo.Base64) {
                return cameraCaptureInfo.Base64;
            }
            const doesExist = await this.file.checkFile(fullImage ? cameraCaptureInfo.Directory : cameraCaptureInfo.ThumbnailDirectory,
                                                        cameraCaptureInfo.FileName);
            if (!doesExist) {
                console.warn(`File ${cameraCaptureInfo.FullPath} does not exist`);
                return null;
            }

            if (!fullImage) {
                return this.win.Ionic.WebView.convertFileSrc(`${cameraCaptureInfo.ThumbnailDirectory}${cameraCaptureInfo.FileName}`);
            } else {
                return await this.file.readAsDataURL(fullImage ? cameraCaptureInfo.Directory : cameraCaptureInfo.ThumbnailDirectory,
                                                    cameraCaptureInfo.FileName);
            }

        } catch (err) {
            this.logger.error('GlobalService::retrievePhoto', err);
            return '';
        }
    }

    async getFileSize(cameraCaptureInfo: ICameraCaptureInfo): Promise<number> {
        try {
            const dir = await this.file.resolveDirectoryUrl(cameraCaptureInfo.Directory);
            const file = await this.file.getFile(dir, cameraCaptureInfo.FileName, { create: false });
            return new Promise((resolve) => {
                file.getMetadata((data) => {
                    resolve(data.size);
                }, (err) => {
                    console.log(err);
                    resolve(null);
                });
            });
        } catch (err) {
            this.logger.error('GlobalService::getFileSize', err);
            return null;
        }
    }

    capturePhoto(storageKey: string): Promise<ICameraCaptureInfo> {
        return new Promise(async (resolve) => {
            await this.actionSheet('Please select photo source:', [
                {
                    text: 'Camera',
                    icon: 'camera',
                    handler: () => {
                        (async () => {
                            const result = await this.getPicture(false, storageKey);
                            resolve(result);
                        })();
                    }
                },
                {
                    text: 'Gallery',
                    icon: 'images',
                    handler: () => {
                        (async () => {
                            const result = await this.getPicture(true, storageKey);
                            resolve(result);
                        })();
                    }
                }
            ]);
        });
    }

    private getPicture(isGallery: boolean, storageKey: string): Promise<ICameraCaptureInfo> {
        return new Promise(async (resolve) => {
            await this.nav.navigateForward(`/camera-capture?gallery=${isGallery}&storageKey=${storageKey}`);

            const cameraPageSubscription = this.messageBus.subscribeToCameraCapturePage().subscribe(x => {
                resolve(x);
                cameraPageSubscription.unsubscribe();
            });
        });
    }

    InitializeImage(img)
    {
       let filePath= this.file.dataDirectory+img;
       let resPath=this.pathForImage(filePath);
    }

    readFile(file:ICameraCaptureInfo)
    {
        console.log('file===========>>>>',file);
       var byteString = atob(file.Base64.split(',')[1]);
  // separate out the mime component
       var mimeString = file.Base64.split(',')[0].split(':')[1].split(';')[0]
            const formData=new FormData();
            const imgBlob=this.dataURItoBlob(file.Base64)
            console.log('imgBlob****global******',imgBlob);
            formData.append('Uploadimage[imageFile]',imgBlob,file.FileName);
            console.log('formData+++global++++++',formData);
          return formData;
    }

    private  dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        let byteString = atob(dataURI.split(',')[1]);
      
        // separate out the mime component
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      
        // write the bytes of the string to an ArrayBuffer
        let ab = new ArrayBuffer(byteString.length);
      
        // create a view into the buffer
        let ia = new Uint8Array(ab);
      
        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
      
        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});
        return blob;
      
      }

    pathForImage(img)
    {
        if(img==null)
        {
            return '';

        } else{
            let converted=this.webview.convertFileSrc(img);
            return converted;
        }

    }

    cleanBase(base64: string): string {
        return base64.replace(/data:.+?,/, '');
    }
}
