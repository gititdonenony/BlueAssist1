/* eslint-disable no-unused-labels */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import { finalize } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'src/app/services/message.service';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.page.html',
  styleUrls: ['./delivery-address.page.scss'],
})
export class DeliveryAddressPage implements OnInit {
  deliveryAddFrom: FormGroup;
  userAddresses: any[] = [];
  selectedAddress: any[] = [];
  options: InAppBrowserOptions = {
    location: 'yes', //Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'no', //Android only ,shows browser zoom controls
    hardwareback: 'yes',
    hideurlbar:'yes',
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
    closebuttoncolor:'#ffffff',
    toolbarcolor:'#0034A9'
  };
  constructor(
    private location: Location,
    public route: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private iab: InAppBrowser
  ) {
    this.myForm();
  }
  myForm() {
    this.deliveryAddFrom = this.fb.group({
      address_rec_name: ['', Validators.required],
      address_full_address: ['', Validators.required],
      address_suburb: ['', Validators.required],
      address_city: ['', Validators.required],
      address_province: ['', Validators.required],
      address_postalcode: ['', Validators.required],
      address_contact: ['', Validators.required],
      address_email: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.getAllAddress();
  }
  goBack() {
    this.location.back();
  }
  gotoCart() {
    this.selectedAddress = this.userAddresses.filter((e) => e.isChecked);
    if (this.selectedAddress.length > 0) {
      const checkoutPayload = {
        addressId: this.selectedAddress[0]._id,
        cartId: localStorage.getItem('cart_id'),
      };
      this.getCheckoutUrl(checkoutPayload);
    }
  }

  checkBoxClick(data) {
    this.userAddresses.map((el) => {
      el.isChecked = false;
    });
    data.isChecked = true;
    this.selectedAddress = data;
  }

  async getAllAddress(): Promise<void> {
    this.userAddresses = [];
    return new Promise(async (resolve) => {
      const loading = await this.loadingController.create({
        spinner: 'crescent',
        cssClass: 'my-custom-class',
      });
      await loading.present();
      this.apiService
        .getDeliveryAddress()
        .pipe(finalize(async () => await loading.dismiss()))
        .subscribe(
          (res: any) => {
            this.userAddresses = res.data.Addresses;
            this.userAddresses.map((el) => {
              el.isChecked = false;
            });
            this.userAddresses.reverse();
            resolve();
          },
          (err) => console.log(err)
        );
    });
  }

  async addAddress() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass: 'my-custom-class',
      message: 'Saving address...',
    });
    await loading.present();
    this.apiService
      .addDeliveryAddress(this.deliveryAddFrom.value)
      .pipe(finalize(async () => await loading.dismiss()))
      .subscribe(
        (res: any) => {
          if (res.operation === 'success') {
            this.getAllAddress().then((resp) => {
              this.userAddresses.map((el) => {
                el.isChecked = false;
              });
              this.userAddresses.map((el) => {
                if (el._id === res.data.address_address_id) {
                  this.checkBoxClick(el);
                }
              });
              this.userAddresses.reverse();
            });
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  async getCheckoutUrl(payload: any) {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass: 'my-custom-class',
      message: 'Saving address...',
    });
    await loading.present();
    this.apiService
      .getCheckoutUrl({ addressId: payload.addressId, cartId: payload.cartId })
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
