import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassengerInfoCapturePageRoutingModule } from './passenger-info-capture-routing.module';

import { PassengerInfoCapturePage } from './passenger-info-capture.page';

import { ComponentsModule } from 'src/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassengerInfoCapturePageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [PassengerInfoCapturePage]
})
export class PassengerInfoCapturePageModule {}
