import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmergencyContactTwoPage } from './emergency-contact-two.page';

const routes: Routes = [
  {
    path: '',
    component: EmergencyContactTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmergencyContactTwoPageRoutingModule {}
