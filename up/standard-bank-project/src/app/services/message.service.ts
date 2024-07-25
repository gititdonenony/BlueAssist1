import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(public toastController: ToastController) {}
  async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 800,
      position: 'top',
    });
    toast.present();
  }

  async presentToastWithDuration(msg: any, duration: number) {
    const toast = await this.toastController.create({
      message: msg,
      // eslint-disable-next-line object-shorthand
      duration: duration,
      position: 'top',
    });
    toast.present();
  }

  async presentErrorToastWithDuration(msg: any, duration: number, clr: string) {
    const toast = await this.toastController.create({
      message: msg,
      // eslint-disable-next-line object-shorthand
      duration: duration,
      position: 'top',
      color: clr,
    });
    toast.present();
  }

  async presentErrorToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 800,
      position: 'top',
      color:'danger'
    });
    toast.present();
  }
  async presentSuccessToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 800,
      position: 'top',
      color: 'success'
    });
    toast.present();
  }

  async presentErrorToastforPackage(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1600,
      position: 'bottom',
      color:'danger'
    });
    toast.present();
  }
}
