import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersnalInfoPage } from './persnal-info.page';

const routes: Routes = [
  {
    path: '',
    component: PersnalInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersnalInfoPageRoutingModule {}
