import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassengerInfoCapturePage } from './passenger-info-capture.page';

const routes: Routes = [
  {
    path: '',
    component: PassengerInfoCapturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassengerInfoCapturePageRoutingModule {}
