import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditFamilyMembersPage } from './edit-family-members.page';

const routes: Routes = [
  {
    path: '',
    component: EditFamilyMembersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditFamilyMembersPageRoutingModule {}
