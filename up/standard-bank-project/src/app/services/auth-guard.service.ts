import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { NavController } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  state: any;
  constructor(private navCtrl: NavController) {
    this.state = localStorage.getItem('userLoginData');
  }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (!this.state) {
      return true;
    } else {
      this.navCtrl.navigateRoot('/login');
      return false;
    }
  }
}
