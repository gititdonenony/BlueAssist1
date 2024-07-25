import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoadcoverPage } from './roadcover.page';

const routes: Routes = [
  {
    path: '',
    component: RoadcoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadcoverPageRoutingModule {}
