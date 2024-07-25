import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmergencyContactsSelectedStatePageRoutingModule } from './emergency-contacts-selected-state-routing.module';

import { EmergencyContactsSelectedStatePage } from './emergency-contacts-selected-state.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmergencyContactsSelectedStatePageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [EmergencyContactsSelectedStatePage]
})
export class EmergencyContactsSelectedStatePageModule {}
