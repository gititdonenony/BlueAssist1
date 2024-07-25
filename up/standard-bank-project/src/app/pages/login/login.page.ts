/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import validator and FormBuilder
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MessageService } from 'src/app/services/message.service';
import { PhotogalleryComponent } from 'src/app/component/photogallery/photogallery.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  //Create FormGroup
  passwordToggleIcon = 'Show';
  loginForm: FormGroup;
  showPassword = false;
  constructor(
    private route: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private modalCtrl:ModalController

  ) {

    this.myForm();

  }

  ngOnInit() { }
  toggleNewPassword() {
    this.showPassword = !this.showPassword;
    if (this.passwordToggleIcon === 'Show') {
      this.passwordToggleIcon = 'Hide';
    } else {
      this.passwordToggleIcon = 'Show';
    }
  }
  //Create required field validator for name
  myForm() {
    this.loginForm = this.fb.group({
      phone: ['', Validators.required],
    });
  }

  loginByNumber() {
    if (this.loginForm.value.phone == '') {
      this.messageService.presentErrorToast('Enter your Phone Number');
    } else if (this.loginForm.valid) {
      const body = {
        action: 'Login_progress',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Phone: this.loginForm.value.phone,
      };
      this.loaderService.showLoader();
      this.apiService.getLoginBYNumber(body).subscribe(
        (res: any) => {
          if (res.hasOwnProperty('operation')) {
            if (res.operation === 'success') {
              this.loaderService.hideLoader();
              localStorage.setItem('userLoginUserID', JSON.stringify(res));
              this.route.navigate(['/otp-validation-login'])
            }
            else if (res.operation === 'error') {
              this.loaderService.hideLoader();
              this.messageService.presentErrorToast(res.message);
            }
          }
        },
        (err) => {
          if (err.hasOwnProperty('status')) {
            if (err.status == '401') {
              this.loaderService.hideLoader();
              this.messageService.presentErrorToast('Invalid Login Credentials');
            } else {
              this.loaderService.hideLoader();
              this.messageService.presentErrorToast('Something Wrong');
            }
          } else {
            this.loaderService.hideLoader();
            this.messageService.presentErrorToast('Something Wrong');
          }
        }
      );
    }
  }




  //? Getting user info for sidebar
  async userInfo(token): Promise<void> {
    return new Promise(async (resolve) => {
      this.apiService.userInfomation(token).subscribe((res: any) => {
        localStorage.setItem('userInfo', JSON.stringify(res));
        resolve();
      });
    });
  }

  signup() {
    this.route.navigate(['/signup'])
  }



async  onClick() {
    const popover = await this.modalCtrl.create({
      component: PhotogalleryComponent,
      cssClass: 'login-unlock-modal-class-d',
    });
    await popover.present();
    const image = await popover.onDidDismiss();
    console.log(image.data.mode);
    console.log(image.data.imageFile);
    console.log(image.data.imageType);
  }
}
