import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmergencyContactsPageRoutingModule } from './emergency-contacts-routing.module';

import { EmergencyContactsPage } from './emergency-contacts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmergencyContactsPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [EmergencyContactsPage]
})
export class EmergencyContactsPageModule {}
