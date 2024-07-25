import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentPhotosPageRoutingModule } from './incident-photos-routing.module';

import { IncidentPhotosPage } from './incident-photos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidentPhotosPageRoutingModule
  ],
  declarations: [IncidentPhotosPage]
})
export class IncidentPhotosPageModule {}
