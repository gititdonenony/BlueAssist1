import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentScenePhotosPage } from './incident-scene-photos.page';

const routes: Routes = [
  {
    path: '',
    component: IncidentScenePhotosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentScenePhotosPageRoutingModule {}
