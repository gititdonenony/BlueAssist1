import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OptionalAddOnePage } from './optional-add-one.page';

const routes: Routes = [
  {
    path: '',
    component: OptionalAddOnePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptionalAddOnePageRoutingModule {}
