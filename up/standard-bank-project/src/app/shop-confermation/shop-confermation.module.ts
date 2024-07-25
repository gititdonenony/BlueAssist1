import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopConfermationPageRoutingModule } from './shop-confermation-routing.module';

import { ShopConfermationPage } from './shop-confermation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopConfermationPageRoutingModule
  ],
  declarations: [ShopConfermationPage]
})
export class ShopConfermationPageModule {}
