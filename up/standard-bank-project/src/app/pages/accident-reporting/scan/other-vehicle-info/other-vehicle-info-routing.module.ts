import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtherVehicleInfoPage } from './other-vehicle-info.page';

const routes: Routes = [
  {
    path: '',
    component: OtherVehicleInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtherVehicleInfoPageRoutingModule {}
