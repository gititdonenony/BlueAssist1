import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteFamilyPageRoutingModule } from './invite-family-routing.module';

import { InviteFamilyPage } from './invite-family.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InviteFamilyPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [InviteFamilyPage]
})
export class InviteFamilyPageModule {}
