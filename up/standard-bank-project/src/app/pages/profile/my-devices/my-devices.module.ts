import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyDevicesPageRoutingModule } from './my-devices-routing.module';

import { MyDevicesPage } from './my-devices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyDevicesPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [MyDevicesPage]
})
export class MyDevicesPageModule {}
