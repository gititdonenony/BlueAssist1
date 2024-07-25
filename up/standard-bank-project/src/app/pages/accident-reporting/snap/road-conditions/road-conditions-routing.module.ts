import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoadConditionsPage } from './road-conditions.page';

const routes: Routes = [
  {
    path: '',
    component: RoadConditionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadConditionsPageRoutingModule {}
