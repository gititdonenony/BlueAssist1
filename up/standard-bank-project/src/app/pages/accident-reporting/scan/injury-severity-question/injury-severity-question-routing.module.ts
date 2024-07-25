import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InjurySeverityQuestionPage } from './injury-severity-question.page';

const routes: Routes = [
  {
    path: '',
    component: InjurySeverityQuestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InjurySeverityQuestionPageRoutingModule {}
