import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseABundlePageRoutingModule } from './choose-a-bundle-routing.module';

import { ChooseABundlePage } from './choose-a-bundle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseABundlePageRoutingModule
  ],
  declarations: [ChooseABundlePage]
})
export class ChooseABundlePageModule {}
