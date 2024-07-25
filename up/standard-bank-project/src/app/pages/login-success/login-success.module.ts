import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginSuccessPageRoutingModule } from './login-success-routing.module';

import { LoginSuccessPage } from './login-success.page';
import { ProfilePage } from '../tabs/profile/profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginSuccessPageRoutingModule
  ],
  declarations: [LoginSuccessPage],
  providers:[ProfilePage]
})
export class LoginSuccessPageModule {}
