import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WitnessInfoPageRoutingModule } from './witness-info-routing.module';

import { WitnessInfoPage } from './witness-info.page';

import { ComponentsModule } from 'src/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WitnessInfoPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [WitnessInfoPage]
})
export class WitnessInfoPageModule {}
