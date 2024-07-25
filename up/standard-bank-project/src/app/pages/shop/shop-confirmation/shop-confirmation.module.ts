import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopConfirmationPageRoutingModule } from './shop-confirmation-routing.module';

import { ShopConfirmationPage } from './shop-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopConfirmationPageRoutingModule
  ],
  declarations: [ShopConfirmationPage]
})
export class ShopConfirmationPageModule {}
