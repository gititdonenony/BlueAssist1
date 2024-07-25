import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PotholePage } from './pothole.page';

const routes: Routes = [
  {
    path: '',
    component: PotholePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PotholePageRoutingModule {}
