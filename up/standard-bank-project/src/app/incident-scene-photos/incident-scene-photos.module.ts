import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentScenePhotosPageRoutingModule } from './incident-scene-photos-routing.module';

import { IncidentScenePhotosPage } from './incident-scene-photos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidentScenePhotosPageRoutingModule
  ],
  declarations: [IncidentScenePhotosPage]
})
export class IncidentScenePhotosPageModule {}
