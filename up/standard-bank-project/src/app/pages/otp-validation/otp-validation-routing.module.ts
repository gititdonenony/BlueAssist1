import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpValidationPage } from './otp-validation.page';

const routes: Routes = [
  {
    path: '',
    component: OtpValidationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpValidationPageRoutingModule {}
