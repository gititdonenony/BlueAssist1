import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinishHomePageRoutingModule } from './finish-home-routing.module';

import { FinishHomePage } from './finish-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinishHomePageRoutingModule
  ],
  declarations: [FinishHomePage]
})
export class FinishHomePageModule {}
