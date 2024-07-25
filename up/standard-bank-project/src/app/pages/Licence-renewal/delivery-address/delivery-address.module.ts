import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveryAddressPageRoutingModule } from './delivery-address-routing.module';

import { DeliveryAddressPage } from './delivery-address.page';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryAddressPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [DeliveryAddressPage],
  providers: [InAppBrowser],
})
export class DeliveryAddressPageModule {}
