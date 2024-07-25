import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicalTwoPage } from './medical-two.page';

const routes: Routes = [
  {
    path: '',
    component: MedicalTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalTwoPageRoutingModule {}
