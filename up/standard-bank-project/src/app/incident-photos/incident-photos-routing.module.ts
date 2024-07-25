import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentPhotosPage } from './incident-photos.page';

const routes: Routes = [
  {
    path: '',
    component: IncidentPhotosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentPhotosPageRoutingModule {}
