import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DangerousGoodsPage } from './dangerous-goods.page';

const routes: Routes = [
  {
    path: '',
    component: DangerousGoodsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DangerousGoodsPageRoutingModule {}
