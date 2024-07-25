import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WitnessInfoPage } from './witness-info.page';

const routes: Routes = [
  {
    path: '',
    component: WitnessInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WitnessInfoPageRoutingModule {}
