import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { CameraService } from '../../app/camera.service'
@Component({
  selector: 'app-generic-popup',
  templateUrl: './generic-popup.page.html',
  styleUrls: ['./generic-popup.page.scss'],
})
export class GenericPopupPage implements OnInit {

  header = '';
  description = '';
  image = '';
  title = '';
  layoverImage = '';

  backButtonText = 'Back';
  continueButtonText = 'Continue';

  buttonsAreActions = false;

  isLottie = false;
  lottieConfig: any = {
    path: '',
    //renderer: 'canvas',
    autoplay: true,
    loop: true
  };
  userprofile: any;
  profileImageData: any;

  constructor(private modalController: ModalController,private camera:CameraService) {
    console.log(this.title);
   }

  
  ngOnInit() {
    if (this.image.endsWith('json')) {
      this.isLottie = true;
      this.lottieConfig.path = this.image;
    } else {
      this.isLottie = false;
    }
    if (!this.backButtonText) {
      this.backButtonText = 'Back';
    }
    if (!this.continueButtonText) {
      this.continueButtonText = 'Continue';
    }

    if (this.backButtonText !== 'Back' || this.continueButtonText !== 'Continue') {
      this.buttonsAreActions = true;
    }
  }

  async close() {
    await this.modalController.dismiss(null, 'close');
  }

  async fail() {
    await this.modalController.dismiss(false, 'fail');
  }

  async success() {

    // this.camera.openCamera().then(data => {
    //   this.userprofile = data;
    //   console.log(data)
    // })
    //console.log('hi')
    await this.modalController.dismiss(true, 'success');
  }

  // async success() {
  
  //   this.camera.chooseimage().then(data => {
  //     // this.profileImageData.profqvalue = data;
  //     this.userprofile = data;
  //     console.log(data)
  //   })
  // }

}
