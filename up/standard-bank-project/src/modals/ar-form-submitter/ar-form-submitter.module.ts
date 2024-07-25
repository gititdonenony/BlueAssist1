import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ArFormSubmitterPage } from './ar-form-submitter.page';

import { LottieAnimationViewModule } from 'ng-lottie';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LottieAnimationViewModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ArFormSubmitterPage],
  entryComponents: [ArFormSubmitterPage],
  providers:[ArFormSubmitterPage],
  exports: [ArFormSubmitterPage]
})
export class ArFormSubmitterPageModule { }
