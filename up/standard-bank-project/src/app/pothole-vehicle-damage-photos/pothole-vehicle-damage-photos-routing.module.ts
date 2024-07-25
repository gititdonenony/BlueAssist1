import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PotholeVehicleDamagePhotosPage } from './pothole-vehicle-damage-photos.page';

const routes: Routes = [
  {
    path: '',
    component: PotholeVehicleDamagePhotosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PotholeVehicleDamagePhotosPageRoutingModule {}
