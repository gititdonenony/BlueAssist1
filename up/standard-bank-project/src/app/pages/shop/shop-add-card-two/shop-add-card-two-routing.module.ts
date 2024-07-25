import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopAddCardTwoPage } from './shop-add-card-two.page';

const routes: Routes = [
  {
    path: '',
    component: ShopAddCardTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopAddCardTwoPageRoutingModule {}
