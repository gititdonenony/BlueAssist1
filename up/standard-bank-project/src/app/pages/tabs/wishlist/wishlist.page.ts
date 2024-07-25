/* eslint-disable max-len */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, ModalController, Platform } from '@ionic/angular';
import {
  NativeGeocoder,
  NativeGeocoderOptions,
  NativeGeocoderResult,
} from '@ionic-native/native-geocoder/ngx';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
  @ViewChild(IonSlides) ionSlides: IonSlides;
  slideOpts: any = {};
  slides: any[] = [];
  activeTab = 0;
  activities: any[] = [];
  userAddress: any;

  constructor(
    private route: Router,
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private nativeGeocoder: NativeGeocoder,
    private platform: Platform
  ) {
    this.apiService
      .printCurrentPosition()
      .then((res) => {
        const location = res.coords;
        this.reverseGeocode(location.latitude, location.longitude);
      })
      .catch((err) => {
      });
  }

  ngOnInit() {
    this.route.navigate(['/licence-renewal-home']);
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
