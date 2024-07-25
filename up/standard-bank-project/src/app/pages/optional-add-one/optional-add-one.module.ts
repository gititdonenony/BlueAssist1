import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptionalAddOnePageRoutingModule } from './optional-add-one-routing.module';

import { OptionalAddOnePage } from './optional-add-one.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptionalAddOnePageRoutingModule
  ],
  declarations: [OptionalAddOnePage]
})
export class OptionalAddOnePageModule {}
