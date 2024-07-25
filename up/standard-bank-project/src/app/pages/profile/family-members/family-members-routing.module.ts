import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamilyMembersPage } from './family-members.page';

const routes: Routes = [
  {
    path: '',
    component: FamilyMembersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamilyMembersPageRoutingModule {}
