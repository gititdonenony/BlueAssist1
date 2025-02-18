import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddVehiclePageRoutingModule } from './add-vehicle-routing.module';

import { AddVehiclePage } from './add-vehicle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddVehiclePageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [AddVehiclePage]
})
export class AddVehiclePageModule {}
