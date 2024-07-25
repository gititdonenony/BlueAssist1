import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditMyVehiclesPage } from './edit-my-vehicles.page';

const routes: Routes = [
  {
    path: '',
    component: EditMyVehiclesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditMyVehiclesPageRoutingModule {}
