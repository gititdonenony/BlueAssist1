import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtherVehicleInfoPageRoutingModule } from './other-vehicle-info-routing.module';

import { OtherVehicleInfoPage } from './other-vehicle-info.page';

import { ComponentsModule } from 'src/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtherVehicleInfoPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [OtherVehicleInfoPage]
})
export class OtherVehicleInfoPageModule {}
