import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddVehiclesTwoPageRoutingModule } from './add-vehicles-two-routing.module';

import { AddVehiclesTwoPage } from './add-vehicles-two.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddVehiclesTwoPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [AddVehiclesTwoPage]
})
export class AddVehiclesTwoPageModule {}
