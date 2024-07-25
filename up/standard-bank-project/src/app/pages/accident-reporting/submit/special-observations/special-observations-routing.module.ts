import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecialObservationsPage } from './special-observations.page';

const routes: Routes = [
  {
    path: '',
    component: SpecialObservationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialObservationsPageRoutingModule {}
