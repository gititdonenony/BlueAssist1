import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicalInformationPage } from './medical-information.page';

const routes: Routes = [
  {
    path: '',
    component: MedicalInformationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalInformationPageRoutingModule {}
