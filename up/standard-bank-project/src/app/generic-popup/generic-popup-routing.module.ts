import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenericPopupPage } from './generic-popup.page';

const routes: Routes = [
  {
    path: '',
    component: GenericPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenericPopupPageRoutingModule {}
