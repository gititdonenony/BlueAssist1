import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpValidationLoginPageRoutingModule } from './otp-validation-login-routing.module';

import { OtpValidationLoginPage } from './otp-validation-login.page';

import { Storage } from '@ionic/storage';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpValidationLoginPageRoutingModule
  ],
  declarations: [OtpValidationLoginPage],
  providers:[Storage]

})
export class OtpValidationLoginPageModule {}
