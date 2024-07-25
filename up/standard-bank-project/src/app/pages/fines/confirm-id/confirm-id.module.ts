import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmIdPageRoutingModule } from './confirm-id-routing.module';

import { ConfirmIdPage } from './confirm-id.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmIdPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ConfirmIdPage]
})
export class ConfirmIdPageModule {}
