import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopTwoPage } from './shop-two.page';

const routes: Routes = [
  {
    path: '',
    component: ShopTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopTwoPageRoutingModule {}
