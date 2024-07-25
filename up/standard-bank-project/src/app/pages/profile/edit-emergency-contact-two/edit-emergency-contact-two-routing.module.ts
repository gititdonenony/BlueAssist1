import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditEmergencyContactTwoPage } from './edit-emergency-contact-two.page';

const routes: Routes = [
  {
    path: '',
    component: EditEmergencyContactTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditEmergencyContactTwoPageRoutingModule {}
