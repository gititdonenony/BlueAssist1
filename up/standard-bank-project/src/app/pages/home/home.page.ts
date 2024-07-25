import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';

import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';

import { StorageService, Tables } from '../../services/storage.service';
import { LoggerService } from '../../services/logger.service';

import { LocationSearchComponent } from './components/location-search/location-search.component';
import { EmergencyFooterComponent } from './components/emergency-footer/emergency-footer.component';

import { Subscription } from 'rxjs';

import { state, trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('zoom', [
      state('in', style({ transform: 'scale(1)' })),
      state('out', style({ transform: 'scale(0)' })),
      transition('* <=> *', [
        animate(150)
      ])
    ])
  ]
})
export class HomePage {
  backButtonSubscription: Subscription;
  routeSubscription: Subscription;
  showOverlay = false;
  emergencyVisible = true;

  @ViewChild('locationComponent', { static: true }) locationComponent: LocationSearchComponent;
  @ViewChild('emergencyFooterComponent', { static: true }) emergencyFooterComponent: EmergencyFooterComponent;

  constructor(private platform: Platform,
              private nav: NavController,
              private storage: StorageService,
              private route: Router,
              private logger: LoggerService,
              private firebase: FirebaseMessaging) {}

  ionViewWillEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
      if (this.showOverlay) {
        this.toggleOverlay();
      } else if (window.location.href.indexOf('home/start') > -1) {
        if (navigator['app']) {
          if (navigator['app'].exitApp) {
            navigator['app'].exitApp();
          }
        }
      } else if (window.location.href.indexOf('home/accident') > -1) {
        await this.nav.navigateBack('/tabs/profile', { animated: true });
      } else if (window.location.href.indexOf('home/snap') > -1 ||
                  window.location.href.indexOf('home/scan') > -1 ||
                  window.location.href.indexOf('home/scan') > -1) {
        await this.nav.navigateBack('home/accident', { animated: true });
      }
    });
    this.routeSubscription = this.route.events.subscribe((event: any) => {
      if (event.url === '/home/start') {
        this.emergencyVisible = true;
      } else {
        this.emergencyVisible = false;
      }
    });
  }

  async ionViewDidEnter() {
    await this.storePushInfo();
  }

  ionViewWillLeave() {
    this.backButtonSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  toggleOverlay() {
    if (this.showOverlay) {
      this.showOverlay = false;
      this.locationComponent.autoCompleteResults = [];
      this.emergencyFooterComponent.isEmergencyContactsOpen = false;
    }
  }

  openOverlay() {
    this.showOverlay = true;
  }
  closeOverlay() {
    this.showOverlay = false;
    this.locationComponent.autoCompleteResults = [];
  }

  private async storePushInfo() {
    try {
      await this.firebase.requestPermission();

      const token = await this.firebase.getToken();

      this.logger.info('FCM Token Fetch', token);

      await this.storage.set(Tables.PushNotificationId, token);
    } catch (err) {
      this.logger.error('HomePage::storePushInfo', err);
    }
  }
}
