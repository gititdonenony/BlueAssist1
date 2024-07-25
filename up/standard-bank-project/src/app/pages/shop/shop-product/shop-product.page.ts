import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-shop-product',
  templateUrl: './shop-product.page.html',
  styleUrls: ['./shop-product.page.scss'],
})
export class ShopProductPage implements OnInit {
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
  constructor(private route: Router, private iab: InAppBrowser,private modalCtrl: ModalController) {}

  ngOnInit() {
    // const url = JSON.parse(localStorage.getItem('userInfo')).shopify_url;
    // this.iab
    //   .create(url, '_self', this.options)
    //   .on('exit')
    //   .subscribe(
    //     (resp) => {
    //       setTimeout(() => {
    //         this.route.navigateByUrl('/tabs/profile');
    //       }, 500);
    //     },
    //     (err) => console.log(err)
    //   );
  }

  close(){
    // this.modalCtrl.dismiss();
    this.route.navigate(['/tabs']);
  }
}
