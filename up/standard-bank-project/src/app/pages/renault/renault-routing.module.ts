import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenaultPage } from './renault.page';

const routes: Routes = [
  {
    path: '',
    component: RenaultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenaultPageRoutingModule {}
