import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialObservationsPageRoutingModule } from './special-observations-routing.module';

import { SpecialObservationsPage } from './special-observations.page';

import { ComponentsModule } from 'src/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialObservationsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SpecialObservationsPage]
})
export class SpecialObservationsPageModule {}
