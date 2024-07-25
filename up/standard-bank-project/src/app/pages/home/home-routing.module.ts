import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
// =============== Body Routing Components =============== //
import { StartComponent } from './components/body/pages/start/start.component';
import { AccidentComponent } from './components/body/pages/accident/accident.component';
import { SnapComponent } from './components/body/pages/snap/snap.component';
import { ScanComponent } from './components/body/pages/scan/scan.component';
import { SubmitComponent } from './components/body/pages/submit/submit.component';
// ======================================================= //

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'start',
        component: StartComponent
      },
      {
        path: 'accident',
        component: AccidentComponent
      },
      {
        path: 'snap',
        component: SnapComponent
      },
      {
        path: 'scan',
        component: ScanComponent
      },
      {
        path: 'submit',
        component: SubmitComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
