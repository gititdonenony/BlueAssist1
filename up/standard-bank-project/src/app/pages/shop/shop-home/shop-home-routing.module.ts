import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopHomePage } from './shop-home.page';

const routes: Routes = [
  {
    path: '',
    component: ShopHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopHomePageRoutingModule {}
