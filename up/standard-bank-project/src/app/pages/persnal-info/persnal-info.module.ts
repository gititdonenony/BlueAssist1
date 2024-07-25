import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersnalInfoPageRoutingModule } from './persnal-info-routing.module';

import { PersnalInfoPage } from './persnal-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersnalInfoPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [PersnalInfoPage]
})
export class PersnalInfoPageModule {}
