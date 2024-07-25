import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicenceInfoPageRoutingModule } from './licence-info-routing.module';

import { LicenceInfoPage } from './licence-info.page';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LicenceInfoPageRoutingModule,
    ReactiveFormsModule,
    MatExpansionModule
  ],
  declarations: [LicenceInfoPage]
})
export class LicenceInfoPageModule {}
