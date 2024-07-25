import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.page.html',
  styleUrls: ['./login-success.page.scss'],
})
export class LoginSuccessPage {
  constructor(private route: Router) {}

  login() {
    this.route.navigate(['/persnal-info']);
  }
  upgrade() {
    this.route.navigate(['/upgrade-package']);
  }

  notRightNow(){
    console.log("Login success not right now");
    
    this.route.navigate(['/tabs/profile', { markerStatus: '3' }]);

  }
}
