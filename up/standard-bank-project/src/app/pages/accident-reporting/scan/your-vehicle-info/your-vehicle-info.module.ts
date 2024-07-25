import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { YourVehicleInfoPageRoutingModule } from './your-vehicle-info-routing.module';

import { YourVehicleInfoPage } from './your-vehicle-info.page';

import { ComponentsModule } from 'src/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    YourVehicleInfoPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [YourVehicleInfoPage]
})
export class YourVehicleInfoPageModule {}
