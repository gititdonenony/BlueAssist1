import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClaimSubmissionSuccessPageRoutingModule } from './claim-submission-success-routing.module';

import { ClaimSubmissionSuccessPage } from './claim-submission-success.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClaimSubmissionSuccessPageRoutingModule
  ],
  declarations: [ClaimSubmissionSuccessPage]
})
export class ClaimSubmissionSuccessPageModule {}
