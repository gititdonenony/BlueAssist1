import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinesDetailsPageRoutingModule } from './fines-details-routing.module';

import { FinesDetailsPage } from './fines-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinesDetailsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FinesDetailsPage]
})
export class FinesDetailsPageModule {}
