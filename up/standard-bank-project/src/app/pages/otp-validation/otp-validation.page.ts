import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'src/app/services/message.service';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-otp-validation',
  templateUrl: './otp-validation.page.html',
  styleUrls: ['./otp-validation.page.scss'],
})
export class OtpValidationPage implements OnInit {

  data: any
  storageValue: any
  otp1: any;
  otp2: any;
  otp3: any;
  otp4: any;

  optionsForAndroid: InAppBrowserOptions = {
    location: 'yes', //Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'no', //Android only ,shows browser zoom controls
    hardwareback: 'yes',
    hideurlbar: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    // closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'yes', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no', //iOS only
    presentationstyle: 'pagesheet', //iOS only
    fullscreen: 'yes', //Windows only,
    // footer:'yes',
    closebuttoncolor: '#ffffff',
    toolbarcolor: '#0034A9'
  };

  optionsForIos: InAppBrowserOptions = {
    location: 'no', //Or 'no'
    hidden: 'yes', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'no', //Android only ,shows browser zoom controls
    hardwareback: 'yes',
    hideurlbar: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'no', //iOS only,
    hideUrl: 'true',
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no', //iOS only
    presentationstyle: 'pagesheet', //iOS only
    fullscreen: 'yes', //Windows only,
    // footer:'yes',
    closebuttoncolor: '#ffffff',
    toolbarcolor: '#0034A9'
  };
  iABRefference: any
  browserRef: any
  newWindow: any
  constructor(private router: ActivatedRoute,
    private route: Router,
    private apiService: ApiService,
    private messageService: MessageService,
    private iab: InAppBrowser,
    private storage: Storage,
    private navCtrl: NavController,
    private storageService: StorageService

  ) {
    this.storage.create();
    this.sendOtp()

  }

  ngOnInit() {

  }
  ionViewDidEnter() {
    const inputElement = document.getElementById('filed1') as HTMLIonInputElement;
    console.log(inputElement);
    inputElement.setFocus();
  }

  sendOtp() {
    this.storageValue = JSON.parse(localStorage.getItem('userSignupData'));
    console.log(this.storageValue.user_id);
    this.data = this.storageValue.message
    console.log(this.data);
    this.apiService.sendOTP(this.storageValue.user_id).subscribe(
      (res: any) => {
        if (res.hasOwnProperty('operation')) {
          if (res.operation === 'success') {
            console.log("OTP send successfully" + JSON.stringify(res));
            // this.messageService.presentSuccessToast(res.message);
          }
        }
      },
      (err) => {
        console.log("error occured in sending otp");
        console.log(err);
      }
    );
  }

  verifyOTP() {
    this.storageValue = JSON.parse(localStorage.getItem('userSignupData'));
    console.log(this.storageValue.user_id);
    this.data = this.storageValue.message
    console.log(this.data);
    const otp = this.otp1 + this.otp2 + this.otp3 + this.otp4;
    console.log('OTP:', otp);
    this.apiService.verifyOtp(this.storageValue.user_id, otp).subscribe(
      (res: any) => {
        if (res.hasOwnProperty('operation')) {
          if (res.operation === 'success') {
            console.log("Otp verifed successfullyy" + JSON.stringify(res));
            this.messageService.presentSuccessToast(res.message);
            localStorage.setItem('paymentUrl', JSON.stringify(res));
            this.checkPaymentStatus()
            this.subscriptionJourney(res.data.redirect_url);
          }
          else if (res.operation === 'error') {
            this.messageService.presentErrorToast("Invalid OTP");
          }
        }
      },
      (err) => {
        console.log("errror in otp verification");
      }
    );
  }

  //? return appropriate token for calling userInfo API 
  async setUserToken(user_data) {
    localStorage.setItem('userLoginData', JSON.stringify(user_data));
    this.storageService.set('WbAuth', user_data.token);
    this.storageService.set('WbAuthV1', user_data.id);
  }

  //?call api for getting user info and set in localstorage
  getUserInfo(token): Promise<void> {
    return new Promise(async (resolve) => {
      this.apiService.userInfomation(token).subscribe(async (res: any) => {
        localStorage.setItem('userInfo', JSON.stringify(res));
        const ret = this.storageService.set('userInfo', JSON.stringify(res));
        resolve();
      });
    });
  }


  checkPaymentStatus() {
    this.apiService.checkPaymentStatus(this.storageValue.user_id).subscribe(
      (res: any) => {
        if (res.hasOwnProperty('operation')) {
          if (res.operation === 'success' && res.status === 'success') {
            console.log("redirect to login page");
            this.iABRefference.close()
            this.setUserToken(res.user_data);
            this.getUserInfo(res.user_data.token)
            this.route.navigate(['/login-success']);
            return
          }
          else if ((res.operation === 'success' && res.status === 'fail')) {
            this.iABRefference.close()
            this.route.navigate(['/signup']);
            return
          }
          else if (res.operation === 'success' && res.status === 'no') {
            console.log("call API again in 2sec");
            setTimeout(() => {
              this.checkPaymentStatus()
            }, 2000);
          }
          else if (res.operation === 'error') {
            console.log("redirect to signup page");
            this.iABRefference.close()
            this.route.navigate(['/signup']);
            return
          }
        }
      },
      (err) => {
        console.log("errror in callig payment API");
      }
    )
  }

  subscriptionJourney(url) {
    const platform = Capacitor.getPlatform();
    console.log(platform);
    console.log("urllllllll " + url);
    if (platform === 'android') {
      console.log("// Your app is running on Android.")
      this.iABRefference = this.iab
        .create(url, '_self', this.optionsForAndroid)
    } else if (platform === 'ios') {
      const option: InAppBrowserOptions = {
        zoom: "yes",
        hideurlbar: "yes",
        hidenavigationbuttons: "yes",
        location: "no"
      }
      this.iABRefference = this.iab.create(url, '_blank', option)
    } else {
      console.log("// Your app is running on another platform.")
      this.iABRefference = this.iab
        .create(url, '_self', this.optionsForAndroid)
    }
  }


  onCloseWebView() {
    this.route.navigateByUrl('/login');
  }

  jumpToNext(event: any, nextInputId: string) {
    const inputElement = document.getElementById(nextInputId) as HTMLIonInputElement;
    if (event.target.value && inputElement) {
      inputElement.setFocus();
    }
  }

  pop() {
    this.route.navigate(['/signup'])
  }

}
