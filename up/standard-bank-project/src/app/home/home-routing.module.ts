import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { StartComponent } from '../pages/home/components/body/pages/start/start.component';
import { AccidentComponent } from '../pages/home/components/body/pages/accident/accident.component';
import { SnapComponent } from '../pages/home/components/body/pages/snap/snap.component';
import { ScanComponent } from '../pages/home/components/body/pages/scan/scan.component';
import { SubmitComponent } from '../pages/home/components/body/pages/submit/submit.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: HomePage,
//   }
// ];

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
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
