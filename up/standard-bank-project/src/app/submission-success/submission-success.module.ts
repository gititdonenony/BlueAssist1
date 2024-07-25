import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmissionSuccessPageRoutingModule } from './submission-success-routing.module';

import { SubmissionSuccessPage } from './submission-success.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubmissionSuccessPageRoutingModule
  ],
  declarations: [SubmissionSuccessPage]
})
export class SubmissionSuccessPageModule {}
