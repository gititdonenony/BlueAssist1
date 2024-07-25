import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonalInfoMyDetailsPage } from './personal-info-my-details.page';

const routes: Routes = [
  {
    path: '',
    component: PersonalInfoMyDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalInfoMyDetailsPageRoutingModule {}
