import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YourInfoPage } from './your-info.page';

const routes: Routes = [
  {
    path: '',
    component: YourInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YourInfoPageRoutingModule {}
