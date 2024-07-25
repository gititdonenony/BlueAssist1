import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicalInformationPageRoutingModule } from './medical-information-routing.module';

import { MedicalInformationPage } from './medical-information.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicalInformationPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [MedicalInformationPage]
})
export class MedicalInformationPageModule {}
