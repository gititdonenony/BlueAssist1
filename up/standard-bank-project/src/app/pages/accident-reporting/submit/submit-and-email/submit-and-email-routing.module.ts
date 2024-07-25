import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmitAndEmailPage } from './submit-and-email.page';

const routes: Routes = [
  {
    path: '',
    component: SubmitAndEmailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmitAndEmailPageRoutingModule {}
