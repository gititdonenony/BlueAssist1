import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccidentScenePageRoutingModule } from './accident-scene-routing.module';

import { AccidentScenePage } from './accident-scene.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccidentScenePageRoutingModule
  ],
  declarations: [AccidentScenePage]
})
export class AccidentScenePageModule {}
