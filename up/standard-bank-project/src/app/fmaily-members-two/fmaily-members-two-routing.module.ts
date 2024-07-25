import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FmailyMembersTwoPage } from './fmaily-members-two.page';

const routes: Routes = [
  {
    path: '',
    component: FmailyMembersTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FmailyMembersTwoPageRoutingModule {}
