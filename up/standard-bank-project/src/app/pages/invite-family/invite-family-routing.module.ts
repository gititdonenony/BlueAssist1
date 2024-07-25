import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InviteFamilyPage } from './invite-family.page';

const routes: Routes = [
  {
    path: '',
    component: InviteFamilyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteFamilyPageRoutingModule {}
