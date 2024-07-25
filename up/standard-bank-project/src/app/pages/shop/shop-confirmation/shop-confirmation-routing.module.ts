import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopConfirmationPage } from './shop-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: ShopConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopConfirmationPageRoutingModule {}
