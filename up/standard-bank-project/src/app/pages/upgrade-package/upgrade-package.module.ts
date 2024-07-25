import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpgradePackagePageRoutingModule } from './upgrade-package-routing.module';

import { UpgradePackagePage } from './upgrade-package.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpgradePackagePageRoutingModule
  ],
  declarations: [UpgradePackagePage]
})
export class UpgradePackagePageModule {}
