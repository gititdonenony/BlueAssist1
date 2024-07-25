import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicenceRenevalHomePageRoutingModule } from './licence-reneval-home-routing.module';

import { LicenceRenevalHomePage } from './licence-reneval-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LicenceRenevalHomePageRoutingModule
  ],
  declarations: [LicenceRenevalHomePage]
})
export class LicenceRenevalHomePageModule {}
