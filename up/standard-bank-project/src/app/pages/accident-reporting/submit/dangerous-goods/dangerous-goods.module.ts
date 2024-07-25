import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DangerousGoodsPageRoutingModule } from './dangerous-goods-routing.module';

import { DangerousGoodsPage } from './dangerous-goods.page';

import { ComponentsModule } from "src/app/component/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DangerousGoodsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DangerousGoodsPage]
})
export class DangerousGoodsPageModule {}
