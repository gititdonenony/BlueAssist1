import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmIdPage } from './confirm-id.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmIdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmIdPageRoutingModule {}
