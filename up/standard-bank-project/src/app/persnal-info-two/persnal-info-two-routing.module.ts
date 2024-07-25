import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersnalInfoTwoPage } from './persnal-info-two.page';

const routes: Routes = [
  {
    path: '',
    component: PersnalInfoTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersnalInfoTwoPageRoutingModule {}
