import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyDetailsPageRoutingModule } from './my-details-routing.module';

import { MyDetailsPage } from './my-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyDetailsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MyDetailsPage]
})
export class MyDetailsPageModule {}
