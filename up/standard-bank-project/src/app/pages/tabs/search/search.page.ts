/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  NavController,
  MenuController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { StartYourAccidentReportComponent } from './../../../start-your-accident-report/start-your-accident-report.component';
import { HomeAssistComponent } from './../../../home-assist/home-assist.component';
import { RoadsideAssistComponent } from './../../../roadside-assist/roadside-assist.component';
import { PtoholeReportMainMenuComponent } from './../../../ptohole-report-main-menu/ptohole-report-main-menu.component';
import { CallLoggedComponent } from './../../../call-logged/call-logged.component';
import {
  NativeGeocoder,
  NativeGeocoderOptions,
  NativeGeocoderResult,
} from '@ionic-native/native-geocoder/ngx';
import { ApiService } from 'src/app/services/api.service';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  userAddress: any;
  constructor(
    private route: Router,
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private nativeGeocoder: NativeGeocoder,
    private platform: Platform,
    private vibration: Vibration
  ) {
    this.apiService
      .printCurrentPosition()
      .then((res) => {
        const location = res.coords;
        this.reverseGeocode(location.latitude, location.longitude);
      })
      .catch((err) => {});
  }

  ngOnInit() {}

  async lockshop(lockdeta) {
    const popover = await this.modalCtrl.create({
      component: StartYourAccidentReportComponent,
      cssClass: 'login-unlock-modal-class',
    });
    return await popover.present();
  }

  async lock(lockdeta) {
    const popover = await this.modalCtrl.create({
      component: HomeAssistComponent,
      cssClass: 'login-unlock-modal-class',
    });
    return await popover.present();
  }

  async roadside(lockdeta) {
    const popover = await this.modalCtrl.create({
      component: RoadsideAssistComponent,
      cssClass: 'login-unlock-modal-class',
    });
    return await popover.present();
  }

  async lockCall(lockdeta) {
    this.vibration.vibrate(1000);
    const popover = await this.modalCtrl.create({
      component: CallLoggedComponent,
      cssClass: 'login-unlock-modal-class',
      backdropDismiss: false,
    });
    return await popover.present();
  }

  async lockPath(lockdeta) {
    const popover = await this.modalCtrl.create({
      component: PtoholeReportMainMenuComponent,
      cssClass: 'login-unlock-modal-class',
    });
    return await popover.present();
  }

  //? get user address
  reverseGeocode(lat, lng) {
    if (this.platform.is('cordova')) {
      const options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5,
      };
      this.nativeGeocoder
        .reverseGeocode(lat, lng, options)
        .then((result: NativeGeocoderResult[]) => {
          this.userAddress = `${result[0].locality},${result[0].subAdministrativeArea},${result[0].administrativeArea},${result[0].countryName}`;
        })
        .catch((error: any) => console.log(error));
    } else {
    }
  }
}
