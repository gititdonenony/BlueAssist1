import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyVehiclesPageRoutingModule } from './my-vehicles-routing.module';

import { MyVehiclesPage } from './my-vehicles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyVehiclesPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [MyVehiclesPage]
})
export class MyVehiclesPageModule {}
