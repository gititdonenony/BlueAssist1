import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClaimSubmissionSuccessPage } from './claim-submission-success.page';

const routes: Routes = [
  {
    path: '',
    component: ClaimSubmissionSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimSubmissionSuccessPageRoutingModule {}
