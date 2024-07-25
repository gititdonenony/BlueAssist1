import { Subscription, timer } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import {
  NavController,
  MenuController,
  ModalController,
  LoadingController,
} from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CallLoggedComponent } from './../call-logged/call-logged.component';
import { switchMap } from 'rxjs/operators';
import { MessageService } from '../services/message.service';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { EventService } from '../services/event.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-assist',
  templateUrl: './home-assist.component.html',
  styleUrls: ['./home-assist.component.scss'],
})
export class HomeAssistComponent implements OnInit {
  @Input() panicStatus;
  subPanicType: any;
  hideCancelBtn: boolean;
  subcribeToPanic: Subscription;
  isPanicActivated: boolean;
  constructor(
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private messageService: MessageService,
    private vibration: Vibration,
    private eventService: EventService
  ) {}

  close() {
    this.modalCtrl.dismiss().then((data) => {
      this.isPanicActivated = data;
    });
  }
  ngOnInit() {
    if (this.panicStatus === true) {
      this.isPanicActivated = true;
    } else {
      this.isPanicActivated = false;
    }
  }

  subType(e) {
    this.subPanicType = e.target.value;
  }
  async lockshop() {
    this.vibration.vibrate(1000);
    if (localStorage.getItem('isHomePanicAlertOn') === 'true') {
      this.messageService.presentToastWithDuration(
        'Panic Alert Already On Progress',
        1000
      );
    } else {
      localStorage.setItem('isHomePanicAlertOn', 'true');
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
      panicType: 'home',
    };
    return new Promise((resolve) => {
      this.apiService
        .printCurrentPosition()
        .then((cords) => {
          const response = this.apiService.postPanic(cords.coords, body);
          response.subscribe(
            async (res: any) => {
              this.eventService.publish('isPanicActivated', {
                isHomepanicActivate: res.status,
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
    localStorage.setItem('isHomePanicAlertOn', 'false');
    this.subcribeToPanic.unsubscribe();
  }
}
