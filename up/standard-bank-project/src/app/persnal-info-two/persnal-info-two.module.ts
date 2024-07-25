import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersnalInfoTwoPageRoutingModule } from './persnal-info-two-routing.module';

import { PersnalInfoTwoPage } from './persnal-info-two.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersnalInfoTwoPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [PersnalInfoTwoPage],
})
export class PersnalInfoTwoPageModule {}
