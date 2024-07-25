import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicenceRenewalHomePageRoutingModule } from './licence-renewal-home-routing.module';

import { LicenceRenewalHomePage } from './licence-renewal-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LicenceRenewalHomePageRoutingModule
  ],
  declarations: [LicenceRenewalHomePage]
})
export class LicenceRenewalHomePageModule {}
