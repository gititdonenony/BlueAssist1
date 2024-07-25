import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LicenceRenewalHomePage } from './licence-renewal-home.page';

const routes: Routes = [
  {
    path: '',
    component: LicenceRenewalHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LicenceRenewalHomePageRoutingModule {}
