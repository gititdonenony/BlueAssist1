import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopOnePage } from './shop-one.page';

const routes: Routes = [
  {
    path: '',
    component: ShopOnePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopOnePageRoutingModule {}
