import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PotholeRoadScenePhotosPageRoutingModule } from './pothole-road-scene-photos-routing.module';

import { PotholeRoadScenePhotosPage } from './pothole-road-scene-photos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PotholeRoadScenePhotosPageRoutingModule
  ],
  declarations: [PotholeRoadScenePhotosPage]
})
export class PotholeRoadScenePhotosPageModule {}
