import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopAddCardPage } from './shop-add-card.page';

const routes: Routes = [
  {
    path: '',
    component: ShopAddCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopAddCardPageRoutingModule {}
