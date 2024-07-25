import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PotholeRoadScenePhotosPage } from './pothole-road-scene-photos.page';

const routes: Routes = [
  {
    path: '',
    component: PotholeRoadScenePhotosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PotholeRoadScenePhotosPageRoutingModule {}
