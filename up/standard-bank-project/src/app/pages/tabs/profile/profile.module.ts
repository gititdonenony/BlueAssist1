import { AppRate } from '@ionic-native/app-rate/ngx';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    GoogleMapsModule,
    // MapKmlLayer
  ],
  declarations: [ProfilePage],
  providers: [AppRate]
})
export class ProfilePageModule {}
