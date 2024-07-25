import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopAddCardPageRoutingModule } from './shop-add-card-routing.module';

import { ShopAddCardPage } from './shop-add-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopAddCardPageRoutingModule
  ],
  declarations: [ShopAddCardPage]
})
export class ShopAddCardPageModule {}
