import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LicenceInfoPage } from './licence-info.page';

const routes: Routes = [
  {
    path: '',
    component: LicenceInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LicenceInfoPageRoutingModule {}
