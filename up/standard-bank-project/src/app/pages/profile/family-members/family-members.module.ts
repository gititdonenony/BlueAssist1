import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamilyMembersPageRoutingModule } from './family-members-routing.module';

import { FamilyMembersPage } from './family-members.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamilyMembersPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [FamilyMembersPage]
})
export class FamilyMembersPageModule {}
