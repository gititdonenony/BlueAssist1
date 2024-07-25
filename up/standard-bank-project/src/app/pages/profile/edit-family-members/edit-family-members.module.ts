import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditFamilyMembersPageRoutingModule } from './edit-family-members-routing.module';

import { EditFamilyMembersPage } from './edit-family-members.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditFamilyMembersPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditFamilyMembersPage]
})
export class EditFamilyMembersPageModule {}
