import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditMyVehiclesPageRoutingModule } from './edit-my-vehicles-routing.module';

import { EditMyVehiclesPage } from './edit-my-vehicles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditMyVehiclesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditMyVehiclesPage]
})
export class EditMyVehiclesPageModule {}
