import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LinkArNumberModalPageRoutingModule } from './link-ar-number-modal-routing.module';

import { LinkArNumberModalPage } from './link-ar-number-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LinkArNumberModalPageRoutingModule
  ],
  declarations: [LinkArNumberModalPage],
  exports: [LinkArNumberModalPage]
})
export class LinkArNumberModalPageModule {}
