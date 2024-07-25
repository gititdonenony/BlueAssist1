import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinesDetailsPage } from './fines-details.page';

const routes: Routes = [
  {
    path: '',
    component: FinesDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinesDetailsPageRoutingModule {}
