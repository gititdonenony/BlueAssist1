import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccidentDetailsPage } from './accident-details.page';

const routes: Routes = [
  {
    path: '',
    component: AccidentDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccidentDetailsPageRoutingModule {}
