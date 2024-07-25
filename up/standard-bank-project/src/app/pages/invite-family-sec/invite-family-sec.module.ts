import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteFamilySecPageRoutingModule } from './invite-family-sec-routing.module';

import { InviteFamilySecPage } from './invite-family-sec.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InviteFamilySecPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [InviteFamilySecPage]
})
export class InviteFamilySecPageModule {}
