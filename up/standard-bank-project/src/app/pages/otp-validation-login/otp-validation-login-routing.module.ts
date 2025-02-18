import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpValidationLoginPage } from './otp-validation-login.page';

const routes: Routes = [
  {
    path: '',
    component: OtpValidationLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpValidationLoginPageRoutingModule {}
