import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmergencyContactTwoPageRoutingModule } from './emergency-contact-two-routing.module';

import { EmergencyContactTwoPage } from './emergency-contact-two.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmergencyContactTwoPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [EmergencyContactTwoPage]
})
export class EmergencyContactTwoPageModule {}
