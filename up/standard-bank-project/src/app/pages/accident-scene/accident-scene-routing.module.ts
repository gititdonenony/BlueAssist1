import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccidentScenePage } from './accident-scene.page';

const routes: Routes = [
  {
    path: '',
    component: AccidentScenePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccidentScenePageRoutingModule {}
