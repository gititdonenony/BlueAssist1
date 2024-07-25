import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicalTwoPageRoutingModule } from './medical-two-routing.module';

import { MedicalTwoPage } from './medical-two.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicalTwoPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [MedicalTwoPage]
})
export class MedicalTwoPageModule {}
