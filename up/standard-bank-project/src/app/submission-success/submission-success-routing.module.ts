import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmissionSuccessPage } from './submission-success.page';

const routes: Routes = [
  {
    path: '',
    component: SubmissionSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmissionSuccessPageRoutingModule {}
