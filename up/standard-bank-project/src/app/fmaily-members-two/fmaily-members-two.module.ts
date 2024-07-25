import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FmailyMembersTwoPageRoutingModule } from './fmaily-members-two-routing.module';

import { FmailyMembersTwoPage } from './fmaily-members-two.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FmailyMembersTwoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FmailyMembersTwoPage]
})
export class FmailyMembersTwoPageModule {}
