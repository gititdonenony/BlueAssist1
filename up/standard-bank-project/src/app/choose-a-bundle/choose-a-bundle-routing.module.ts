import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseABundlePage } from './choose-a-bundle.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseABundlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseABundlePageRoutingModule {}
