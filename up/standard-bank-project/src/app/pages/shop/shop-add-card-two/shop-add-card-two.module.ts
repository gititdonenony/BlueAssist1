import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopAddCardTwoPageRoutingModule } from './shop-add-card-two-routing.module';

import { ShopAddCardTwoPage } from './shop-add-card-two.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopAddCardTwoPageRoutingModule
  ],
  declarations: [ShopAddCardTwoPage]
})
export class ShopAddCardTwoPageModule {}
