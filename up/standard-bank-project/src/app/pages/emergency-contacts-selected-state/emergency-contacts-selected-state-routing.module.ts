import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmergencyContactsSelectedStatePage } from './emergency-contacts-selected-state.page';

const routes: Routes = [
  {
    path: '',
    component: EmergencyContactsSelectedStatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmergencyContactsSelectedStatePageRoutingModule {}
