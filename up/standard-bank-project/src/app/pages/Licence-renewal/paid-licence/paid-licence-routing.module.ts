import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaidLicencePage } from './paid-licence.page';

const routes: Routes = [
  {
    path: '',
    component: PaidLicencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaidLicencePageRoutingModule {}
