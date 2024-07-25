import { environment } from './../../environments/environment';
import { MessageService } from 'src/app/services/message.service';
import { Component, Input, OnInit } from '@angular/core';
import {
  NavController,
  MenuController,
  ModalController,
  LoadingController,
} from '@ionic/angular';
import { interval, Subscription, Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { CallLoggedComponent } from './../call-logged/call-logged.component';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-roadside-assist',
  templateUrl: './roadside-assist.component.html',
  styleUrls: ['./roadside-assist.component.scss'],
})
export class RoadsideAssistComponent implements OnInit {
  @Input() panicStatus;
  subcribeToPanic: Subscription;
  subPanicType: any;
  hideCancelBtn: boolean;
  buttonColor = '#0033AA';
  isPanicActivated: boolean;

  constructor(
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private messageService: MessageService,
    private vibration: Vibration,
    private eventService: EventService
  ) {
    this.hideCancelBtn = false;
  }

  ngOnInit() {
    if (this.panicStatus === true) {
      this.isPanicActivated = true;
    } else {
      this.isPanicActivated = false;
    }
  }
  close() {
    this.modalCtrl.dismiss().then((data) => {
      this.isPanicActivated = data;
    });
  }
  subType(e) {
    this.subPanicType = e.target.value;
  }
  async lockshop() {
    this.vibration.vibrate(1000);
    if (localStorage.getItem('isRoadPanicAlertOn') === 'true') {
      this.messageService.presentToastWithDuration(
        'Panic Alert Already On Progress',
        1000
      );
    } else {
      localStorage.setItem('isRoadPanicAlertOn', 'true');
      this.showPanicConfirmPopup();
      this.callPanicAlertRepetadely();
      this.modalCtrl.dismiss().then((data) => {
        this.isPanicActivated = data;
      });
    }
  }

  //?  create panic alert
  async createPanicAlert() {
    const body = {
      subPanicType: this.subPanicType,
      panicType: 'road',
    };
    return new Promise((resolve) => {
      this.apiService
        .printCurrentPosition()
        .then((cords) => {
          const response = this.apiService.postPanic(cords.coords, body);
          response.subscribe(
            async (res: any) => {
              console.log('road panic status', res.status);
              this.eventService.publish('isPanicActivated', {
                isRoadpanicActivate: res.status,
              });
              if (res.operation === 'success' && res.status) {
                this.stop();
              }
            },
            (err) => console.error(err.data)
          );
        })
        .catch(async (err) => {
          console.error(err);
        });
    });
  }

  //? show popup
  async showPanicConfirmPopup() {
    const popover = await this.modalCtrl.create({
      component: CallLoggedComponent,
      cssClass: 'login-unlock-modal-class-d',
    });
    await popover.present();
  }

  //? call panic alert every five min
  callPanicAlertRepetadely() {
    this.subcribeToPanic = timer(0, environment.panicApiCallTime)
      .pipe(switchMap(async () => this.createPanicAlert()))
      .subscribe((res) => console.log('res', res));
  }

  //? disable the reapeating panic api call
  stop() {
    localStorage.setItem('isRoadPanicAlertOn', 'false');
    this.subcribeToPanic.unsubscribe();
  }
}
