import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

//#region ============== Directives ============== //
import { SvgIconDirectiveModule } from 'src/directives/svg-icon.directive';
//#endregion ===================================== //

import { IconRadioListComponentComponent } from 'src/components/icon-radio-list-component/icon-radio-list-component.component';
import { PageFooterComponent } from 'src/components/page-footer/page-footer.component';
import { CustomSlidesPagerComponent } from 'src/components/custom-slides-pager/custom-slides-pager.component';
// import { TabFooterBarComponent } from './tab-footer-bar/tab-footer-bar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SvgIconDirectiveModule
  ],
  declarations: [
    IconRadioListComponentComponent,
    PageFooterComponent,
    CustomSlidesPagerComponent
  ],
  exports: [
    IconRadioListComponentComponent,
    PageFooterComponent,
    CustomSlidesPagerComponent
  ]
})
export class ComponentsModule {}
