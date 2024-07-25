import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopOnePageRoutingModule } from './shop-one-routing.module';

import { ShopOnePage } from './shop-one.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopOnePageRoutingModule
  ],
  declarations: [ShopOnePage]
})
export class ShopOnePageModule {}
