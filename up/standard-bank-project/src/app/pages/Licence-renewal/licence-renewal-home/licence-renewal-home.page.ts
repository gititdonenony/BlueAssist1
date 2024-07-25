/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable radix */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MessageService } from 'src/app/services/message.service';
import { Location } from '@angular/common';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-licence-renewal-home',
  templateUrl: './licence-renewal-home.page.html',
  styleUrls: ['./licence-renewal-home.page.scss'],
})
export class LicenceRenewalHomePage implements OnInit {
  userObject: any;
  token: any;
  getVehicleData: any;
  showGetList = false;
  date = new Date();
  todayDate = new Date().getDate();
  todayMonth = new Date().getMonth();
  todayYear = new Date().getFullYear();
  basketList: any[] = [];

  constructor(
    private location: Location,
    private route: Router,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.token = this.userObject.token;
    }
    this.getVehicleList();
  }
  goBack() {
    this.location.back();
  }
  async getVehicleList() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass: 'my-custom-class',

    });
    await loading.present();
    this.apiService
      .getVehicle(this.token)
      .pipe(finalize(async () => await loading.dismiss()))
      .subscribe(async (res: any) => {
        if (res.data.length > 0) {
          res.data.map((e) => {
            const dateArray = e.vehicle_expiry_date.split('-');
            const year = parseInt(dateArray[0]);
            const month = parseInt(dateArray[1]);
            const day = parseInt(dateArray[2]);
            const today = new Date().toISOString().slice(0, 10);
            const currentDateArray = today.split('-');
            const currentYear = parseInt(currentDateArray[0]);
            const currentMonth = parseInt(currentDateArray[1]);
            const currentDay = parseInt(currentDateArray[2]);
            if (today > e.vehicle_expiry_date) {
              e.licence_status = 'expired';
            } else if (today <= e.vehicle_expiry_date) {
              if (year === currentYear && month === currentMonth) {
                e.licence_status = 'About to expire';
              } else {
                e.licence_status = 'Valid';
              }
            }
          });
        }
        this.getVehicleData = res.data;
        this.getBaskets();
        if (res.data.length !== 0) {
          this.showGetList = true;
        }
      });
  }

  async addToBasket() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass: 'my-custom-class',
    });
    await loading.present();
    this.basketList = this.getVehicleData.filter((ele) => ele.isChecked);
    setTimeout(() => {
      this.basketList.map((e) => {
        this.apiService
          .addToBasket(this.token, e.vehicle_id)
          .subscribe((res) => console.log(res));
      });
      setTimeout(async () => {
        this.route.navigate(['/licence-info']);
        await loading.dismiss();
      }, 1000);
    }, 500);
  }

  async getBaskets() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass: 'my-custom-class',
    });
    await loading.present();
    this.apiService.allBasket(this.token).subscribe(
      async (res: any) => {
        if (res.operation === 'success') {
          const baskets: any[] = res.data.basket;
          if (baskets.length) {
            for (let i = 0; i < baskets.length; i++) {
              for (let j = 0; j < this.getVehicleData.length; j++) {
                if (
                  baskets[i].vehicle_id === this.getVehicleData[j].vehicle_id
                ) {
                  this.getVehicleData[j].isChecked = true;
                  break;
                }
              }
            }
          }
        }
        await loading.dismiss();
      },
      async (err) => {
        await loading.dismiss();
        console.log(err);
      }
    );
  }
}
