import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PotholePageRoutingModule } from './pothole-routing.module';

import { PotholePage } from './pothole.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PotholePageRoutingModule
  ],
  declarations: [PotholePage]
})
export class PotholePageModule {}
