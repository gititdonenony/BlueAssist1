import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccidentDetailsPageRoutingModule } from './accident-details-routing.module';

import { AccidentDetailsPage } from './accident-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccidentDetailsPageRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [AccidentDetailsPage]
})
export class AccidentDetailsPageModule {}
