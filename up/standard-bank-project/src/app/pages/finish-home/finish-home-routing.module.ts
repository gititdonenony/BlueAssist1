import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinishHomePage } from './finish-home.page';

const routes: Routes = [
  {
    path: '',
    component: FinishHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinishHomePageRoutingModule {}
