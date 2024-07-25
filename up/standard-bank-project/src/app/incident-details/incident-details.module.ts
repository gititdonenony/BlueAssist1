import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentDetailsPageRoutingModule } from './incident-details-routing.module';

import { IncidentDetailsPage } from './incident-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidentDetailsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [IncidentDetailsPage]
})
export class IncidentDetailsPageModule {}
