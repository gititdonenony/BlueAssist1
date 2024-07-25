import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddVehiclesTwoPage } from './add-vehicles-two.page';

const routes: Routes = [
  {
    path: '',
    component: AddVehiclesTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddVehiclesTwoPageRoutingModule {}
