import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpgradePackagePage } from './upgrade-package.page';

const routes: Routes = [
  {
    path: '',
    component: UpgradePackagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpgradePackagePageRoutingModule {}
