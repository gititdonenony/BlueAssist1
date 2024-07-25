import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LinkArNumberModalPage } from './link-ar-number-modal.page';

const routes: Routes = [
  {
    path: '',
    component: LinkArNumberModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LinkArNumberModalPageRoutingModule {}
