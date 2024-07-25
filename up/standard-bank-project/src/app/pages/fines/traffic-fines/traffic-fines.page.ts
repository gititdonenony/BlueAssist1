/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable eqeqeq */
import { finalize } from 'rxjs/operators';
/* eslint-disable radix */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@awesome-cordova-plugins/in-app-browser/ngx';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-traffic-fines',
  templateUrl: './traffic-fines.page.html',
  styleUrls: ['./traffic-fines.page.scss'],
})
export class TrafficFinesPage implements OnInit {
  idNumber: any;
  userObject: any;
  token: any;
  noticeNo: string;
  finesData: any[] = [];
  totalAmt = 0;
  noticeNumberList: any;
  options: InAppBrowserOptions = {
    location: 'yes', //Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'no', //Android only ,shows browser zoom controls
    hardwareback: 'yes',
    hideurlbar: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'yes', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no', //iOS only
    presentationstyle: 'pagesheet', //iOS only
    fullscreen: 'yes', //Windows only,
    // footer:'yes',
    closebuttoncolor: '#ffffff',
    toolbarcolor: '#0034A9',
  };
  updatedCheckoutList: any;

  constructor(
    public route: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private iab: InAppBrowser,
    private messageService: MessageService
  ) {
    this.idNumber = this.activatedRoute.snapshot.paramMap.get('state');
  }

  ngOnInit() {
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.token = this.userObject.token;
    }
    this.getFines();
  }
  async getFines() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
    });

    loading.present();
    this.apiService
      .getFines(this.idNumber, this.token)
      .pipe(finalize(async () => await loading.dismiss()))
      .subscribe(
        (res: any) => {
          this.finesData = JSON.parse(res.data.FineList);
          const unPaidFines = this.finesData.filter(
            (e) => e.statusDescription !== 'Paid'
          );
          unPaidFines.map((el) => {
            this.totalAmt = this.totalAmt + parseInt(el.amountDue);
          });
          this.finesData.map((data) => {
            data.delete = false;
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  checkboxClick(e, event) {
    event.stopPropagation();
    this.finesData.map((el) => {
      if (el.noticeNumber == e.noticeNumber) {
        el.delete = !e.delete;
        if (el.delete) {
          this.totalAmt = this.totalAmt - parseInt(e.amountDue);
        } else {
          this.totalAmt = this.totalAmt + parseInt(e.amountDue);
        }
      }
    });
  }
  detail(data) {
    localStorage.setItem('fine-data', JSON.stringify(data));
    setTimeout(() => {
      this.route.navigate(['/fines-details']);
    }, 200);
  }
  async checkout() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'my-custom-class',
    });
    await loading.present();
    const filteredReasult = this.finesData.filter((e) => !e.delete);

    this.noticeNumberList = filteredReasult
      .map((e) => e.noticeNumber)
      .join(',');
    this.apiService
      .checkoutFine(this.noticeNumberList, this.idNumber, this.token)
      .pipe(finalize(async () => await loading.dismiss()))
      .subscribe(
        (res: any) => {
          if (res.hasOwnProperty('operation')) {
            if (res.operation === 'success') {
              this.iab
                .create(res.data, '_self', this.options)
                .on('message')
                .subscribe(
                  (resp) => console.log(resp),
                  (err) => console.log(err)
                );
            } else {
              this.messageService.presentErrorToast(res.data);
            }
          }
        },
        (error) => {
          console.log('error', error);
        }
      );
  }
}
