import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtherDriverInfoPageRoutingModule } from './other-driver-info-routing.module';

import { OtherDriverInfoPage } from './other-driver-info.page';

import { ComponentsModule } from 'src/app/component/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtherDriverInfoPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [OtherDriverInfoPage]
})
export class OtherDriverInfoPageModule {}
