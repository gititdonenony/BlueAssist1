import { Component, OnInit } from '@angular/core';

import { LoginSignupService } from './login-signup.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.page.html',
  styleUrls: ['./login-signup.page.scss'],
  providers: [
    LoginSignupService
  ]
})
export class LoginSignupPage implements OnInit {

  loginForm: FormGroup;
  signupForm: FormGroup;

  isLogin = true;

  constructor(private service: LoginSignupService) { }

  ngOnInit() {
    const forms = this.service.initialize();
    this.loginForm = forms.LoginForm;
    this.signupForm = forms.SignupForm;
  }

  async close() {
    await this.service.closeForm();
  }

  async login() {
    if (!this.isLogin) {
      this.isLogin = true;
    } else {
      await this.service.login();
    }
  }

  async signUp() {
    if (this.isLogin) {
      this.isLogin = false;
    } else {
      await this.service.signUp();
    }
  }

}
