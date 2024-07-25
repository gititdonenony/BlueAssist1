import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { YourVehicleDamagesPageRoutingModule } from './your-vehicle-damages-routing.module';

import { YourVehicleDamagesPage } from './your-vehicle-damages.page';

import { ComponentsModule } from 'src/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    YourVehicleDamagesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [YourVehicleDamagesPage]
})
export class YourVehicleDamagesPageModule {}
