import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoadConditionsPageRoutingModule } from './road-conditions-routing.module';

import { RoadConditionsPage } from './road-conditions.page';

import { ComponentsModule } from 'src/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoadConditionsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RoadConditionsPage]
})
export class RoadConditionsPageModule {}
