import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenericPopupPageRoutingModule } from './generic-popup-routing.module';

import { GenericPopupPage } from './generic-popup.page';
import { LottieAnimationViewModule } from 'ng-lottie';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LottieAnimationViewModule,
    GenericPopupPageRoutingModule
  ],
  declarations: [GenericPopupPage]
})
export class GenericPopupPageModule {}
