import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonalInfoMyDetailsPageRoutingModule } from './personal-info-my-details-routing.module';

import { PersonalInfoMyDetailsPage } from './personal-info-my-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonalInfoMyDetailsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PersonalInfoMyDetailsPage]
})
export class PersonalInfoMyDetailsPageModule {}
