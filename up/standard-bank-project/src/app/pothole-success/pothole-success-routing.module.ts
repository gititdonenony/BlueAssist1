import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PotholeSuccessPage } from './pothole-success.page';

const routes: Routes = [
  {
    path: '',
    component: PotholeSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PotholeSuccessPageRoutingModule {}
