import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaidLicencePageRoutingModule } from './paid-licence-routing.module';

import { PaidLicencePage } from './paid-licence.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaidLicencePageRoutingModule
  ],
  declarations: [PaidLicencePage]
})
export class PaidLicencePageModule {}
