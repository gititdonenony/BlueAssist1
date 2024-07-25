import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoadcovePageRoutingModule } from './roadcove-routing.module';

import { RoadcovePage } from './roadcove.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoadcovePageRoutingModule
  ],
  declarations: [RoadcovePage]
})
export class RoadcovePageModule {}
