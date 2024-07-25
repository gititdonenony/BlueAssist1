import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditEmergencyContactTwoPageRoutingModule } from './edit-emergency-contact-two-routing.module';

import { EditEmergencyContactTwoPage } from './edit-emergency-contact-two.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditEmergencyContactTwoPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [EditEmergencyContactTwoPage]
})
export class EditEmergencyContactTwoPageModule {}
