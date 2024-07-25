import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RenaultPageRoutingModule } from './renault-routing.module';

import { RenaultPage } from './renault.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RenaultPageRoutingModule
  ],
  declarations: [RenaultPage]
})
export class RenaultPageModule {}
