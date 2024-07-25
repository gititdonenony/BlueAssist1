import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PotholeSuccessPageRoutingModule } from './pothole-success-routing.module';

import { PotholeSuccessPage } from './pothole-success.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PotholeSuccessPageRoutingModule
  ],
  declarations: [PotholeSuccessPage]
})
export class PotholeSuccessPageModule {}
