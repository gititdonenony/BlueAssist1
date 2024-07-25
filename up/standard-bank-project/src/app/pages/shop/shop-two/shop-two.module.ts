import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopTwoPageRoutingModule } from './shop-two-routing.module';

import { ShopTwoPage } from './shop-two.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopTwoPageRoutingModule
  ],
  declarations: [ShopTwoPage]
})
export class ShopTwoPageModule {}
