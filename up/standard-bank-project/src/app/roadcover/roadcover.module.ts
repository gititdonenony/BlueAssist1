import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoadcoverPageRoutingModule } from './roadcover-routing.module';

import { RoadcoverPage } from './roadcover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoadcoverPageRoutingModule
  ],
  declarations: [RoadcoverPage]
})
export class RoadcoverPageModule {}
