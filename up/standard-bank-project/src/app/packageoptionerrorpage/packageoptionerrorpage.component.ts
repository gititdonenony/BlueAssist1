import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MessageService } from '../services/message.service';
import { LoaderService } from '../services/loader.service';
import { ApiService } from '../services/api.service';
import { Capacitor } from '@capacitor/core';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-packageoptionerrorpage',
  templateUrl: './packageoptionerrorpage.component.html',
  styleUrls: ['./packageoptionerrorpage.component.scss'],
})
export class PackageoptionerrorpageComponent implements OnInit {

  paymentUrl
  iABRefference: any
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

  constructor(
    private modalCtrl: ModalController,

    private apiService: ApiService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private iab: InAppBrowser,
    private route: Router,


  ) { }

  ngOnInit() { }


  close() {
    this.modalCtrl.dismiss()
  }

  upgradePlan() {
    var token = JSON.parse(localStorage.getItem('userLoginData'));
    console.log("tokennnnnn: " + token.token);
    this.apiService.upgradePlan(token.token).subscribe(
      (res: any) => {
        if (res.hasOwnProperty('operation')) {
          if (res.operation === 'success') {
            console.log(res.data.redirect_url);
            this.loaderService.showLoader()
            setTimeout(() => {
              this.loaderService.hideLoader()
              // this.checkPaymentStatus(token.id)
            }, 2000);

            this.subscriptionJourney(res.data.redirect_url)
          }
          else if (res.operation === 'error') {
            this.messageService.presentErrorToast("something went wrong");
          }
        }
      },
      (err) => {
        console.log("errror in registraion");
      }
    );
  }

  checkPaymentStatus(id: any) {
    this.apiService.checkPaymentStatus(id).subscribe(
      (res: any) => {
        if (res.hasOwnProperty('operation')) {
          if (res.operation === 'success' && res.status === 'success') {
            console.log("redirect to login page");
            this.iABRefference.close()
            this.modalCtrl.dismiss()
            this.route.navigate(['/tabs/profile']);
            return
          }
          else if ((res.operation === 'success' && res.status === 'fail')) {
            this.iABRefference.close()
            this.modalCtrl.dismiss()
            this.route.navigate(['/tabs/profile']);
            return
          }
          else if (res.operation === 'success' && res.status === 'no') {
            console.log("call API again in 2sec");
            this.modalCtrl.dismiss()
            setTimeout(() => {
              this.checkPaymentStatus(id)
            }, 2000);
          }
          else if (res.operation === 'error') {
            console.log("redirect to signup page");
            this.modalCtrl.dismiss()
            this.iABRefference.close()
            this.route.navigate(['/tabs/profile']);
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


}
