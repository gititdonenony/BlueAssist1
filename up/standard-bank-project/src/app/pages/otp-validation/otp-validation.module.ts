import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpValidationPageRoutingModule } from './otp-validation-routing.module';

import { OtpValidationPage } from './otp-validation.page';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Storage } from '@ionic/storage';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpValidationPageRoutingModule
  ],
  declarations: [OtpValidationPage],
  providers: [InAppBrowser,Storage],
})
export class OtpValidationPageModule {}
