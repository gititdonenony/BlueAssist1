import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoadcovePage } from './roadcove.page';

const routes: Routes = [
  {
    path: '',
    component: RoadcovePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadcovePageRoutingModule {}
