import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtherVehicleDamagesPage } from './other-vehicle-damages.page';

const routes: Routes = [
  {
    path: '',
    component: OtherVehicleDamagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtherVehicleDamagesPageRoutingModule {}
