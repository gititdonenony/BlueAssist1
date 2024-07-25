import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopConfermationPage } from './shop-confermation.page';

const routes: Routes = [
  {
    path: '',
    component: ShopConfermationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopConfermationPageRoutingModule {}
