import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopCartPageRoutingModule } from './shop-cart-routing.module';

import { ShopCartPage } from './shop-cart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopCartPageRoutingModule
  ],
  declarations: [ShopCartPage]
})
export class ShopCartPageModule {}
