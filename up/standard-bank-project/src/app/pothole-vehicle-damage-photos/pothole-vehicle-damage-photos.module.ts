import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PotholeVehicleDamagePhotosPageRoutingModule } from './pothole-vehicle-damage-photos-routing.module';

import { PotholeVehicleDamagePhotosPage } from './pothole-vehicle-damage-photos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PotholeVehicleDamagePhotosPageRoutingModule
  ],
  declarations: [PotholeVehicleDamagePhotosPage]
})
export class PotholeVehicleDamagePhotosPageModule {}
