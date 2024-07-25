import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YourVehicleDamagesPage } from './your-vehicle-damages.page';

const routes: Routes = [
  {
    path: '',
    component: YourVehicleDamagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YourVehicleDamagesPageRoutingModule {}
