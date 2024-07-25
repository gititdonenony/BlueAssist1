import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehicleInfoPageRoutingModule } from './vehicle-info-routing.module';

import { VehicleInfoPage } from './vehicle-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehicleInfoPageRoutingModule
  ],
  declarations: [VehicleInfoPage]
})
export class VehicleInfoPageModule {}
