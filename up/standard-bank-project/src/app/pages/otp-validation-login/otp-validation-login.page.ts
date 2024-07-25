import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'src/app/services/message.service';
import { Storage } from '@ionic/storage';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-otp-validation-login',
  templateUrl: './otp-validation-login.page.html',
  styleUrls: ['./otp-validation-login.page.scss'],
})

export class OtpValidationLoginPage implements OnInit {

  data: any
  storageValue: any
  otp1: any;
  otp2: any;
  otp3: any;
  otp4: any;

  constructor(private router: ActivatedRoute,
    private route: Router,
    private apiService: ApiService,
    private messageService: MessageService,
    private storage: Storage,
    private storageService: StorageService
  ) {
  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    const inputElement = document.getElementById('filed1') as HTMLIonInputElement;
    console.log(inputElement);
    inputElement.setFocus();
  }

  verifyOTP() {
    this.storageValue = JSON.parse(localStorage.getItem('userLoginUserID'));
    console.log(this.storageValue.user_id);
    this.data = this.storageValue.message
    console.log(this.data);
    const otp = this.otp1 + this.otp2 + this.otp3 + this.otp4;
    console.log('OTP:', otp);
    this.apiService.verifyLoginOtp(this.storageValue.user_id, otp).subscribe(
      (res: any) => {
        if (res[0].hasOwnProperty('operation')) {
          if (res[0].operation === 'success') {
            console.log("Otp verifed successfullyy" + JSON.stringify(res[0]));
            this.messageService.presentSuccessToast("You are successfully logged in.");
            localStorage.setItem('userLoginData', JSON.stringify(res[0]));
            this.storageService.set('WbAuth', res[0].token);
            this.storageService.set('WbAuthV1', res[0].id);
            this.userInfo(res[0].token);
            this.route.navigate(['/login-success']);
          }
          else if (res[0].operation === 'error') {
            this.messageService.presentErrorToast("Invalid OTP");
          }
        }
      },
      (err) => {
        console.log("errror in otp verification");
      }
    );
  }


  //? Getting user info for sidebar
  async userInfo(token): Promise<void> {
    return new Promise(async (resolve) => {
      this.apiService.userInfomation(token).subscribe(async (res: any) => {
        localStorage.setItem('userInfo', JSON.stringify(res));
        // const data = await this.storageService.get("token", {});
        // console.log(data);
        const ret = this.storageService.set('userInfo', JSON.stringify(res));
        resolve();
      });
    });
  }


  jumpToNext(event: any, nextInputId: string) {
    const inputElement = document.getElementById(nextInputId) as HTMLIonInputElement;
    if (event.target.value && inputElement) {
      inputElement.setFocus();
    }
  }
  pop() {
    this.route.navigate(['/login'])
  }

}
