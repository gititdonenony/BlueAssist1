import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtherDriverInfoPage } from './other-driver-info.page';

const routes: Routes = [
  {
    path: '',
    component: OtherDriverInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtherDriverInfoPageRoutingModule {}
