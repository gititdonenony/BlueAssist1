import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicenceCartPageRoutingModule } from './licence-cart-routing.module';

import { LicenceCartPage } from './licence-cart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LicenceCartPageRoutingModule
  ],
  declarations: [LicenceCartPage]
})
export class LicenceCartPageModule {}
