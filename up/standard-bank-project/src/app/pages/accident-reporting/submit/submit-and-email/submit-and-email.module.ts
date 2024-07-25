import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmitAndEmailPageRoutingModule } from './submit-and-email-routing.module';

import { SubmitAndEmailPage } from './submit-and-email.page';

import { ComponentsModule } from 'src/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubmitAndEmailPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [SubmitAndEmailPage],
})
export class SubmitAndEmailPageModule {}
