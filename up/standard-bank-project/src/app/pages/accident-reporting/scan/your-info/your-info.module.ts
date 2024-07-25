import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { YourInfoPageRoutingModule } from './your-info-routing.module';

import { YourInfoPage } from './your-info.page';

import { ComponentsModule } from 'src/components/components.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    YourInfoPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [YourInfoPage]
})
export class YourInfoPageModule {}
