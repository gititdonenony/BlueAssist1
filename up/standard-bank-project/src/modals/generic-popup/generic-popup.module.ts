import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenericPopupPage } from './generic-popup.page';

//#region =============== COMPONENTS =============== //
import { ComponentsModule } from '../../components/components.module';
//#endregion ======================================= //

import { LottieAnimationViewModule } from 'ng-lottie';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    LottieAnimationViewModule.forRoot()
  ],
  declarations: [GenericPopupPage]
})
export class GenericPopupPageModule {}
