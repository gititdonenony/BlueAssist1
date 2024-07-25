import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrafficFinesPageRoutingModule } from './traffic-fines-routing.module';

import { TrafficFinesPage } from './traffic-fines.page';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrafficFinesPageRoutingModule
  ],
  declarations: [TrafficFinesPage],
  providers: [InAppBrowser]
})
export class TrafficFinesPageModule {}
