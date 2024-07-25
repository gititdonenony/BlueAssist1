import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private loaderService: LoaderService,
    private route: Router,
    private apiService: ApiService,

  ) {
    this.myForm()
  }

  ngOnInit() {
  }

  //Create required field validator for name
  myForm() {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  signup() {
    if (this.loginForm.value.name == '') {
      this.messageService.presentErrorToast('Enter your FullName');
    } else if (this.loginForm.value.phone == '') {
      this.messageService.presentErrorToast('Enter your Phone number');
    } else if (this.loginForm.value.email == '') {
      this.messageService.presentErrorToast('Enter your Email ID');
    } else if (this.loginForm.valid) {
      const body = {
        action: 'Signup_progress',
        Username: this.loginForm.value.name,
        Phone: this.loginForm.value.phone,
        Email: this.loginForm.value.email
      };
      this.loaderService.showLoader();
      this.apiService.getSignup(body).subscribe(
        (res: any) => {
          if (res.hasOwnProperty('operation')) {
            if (res.operation === 'success') {
              this.loaderService.hideLoader();
              console.log("Sign in Succesfull" + JSON.stringify(res));
              // this.messageService.presentSuccessToast('You are successfully logged in');
              localStorage.setItem('userSignupData', JSON.stringify(res));
              this.route.navigate(['/otp-validation'])
            } else if (res.operation === 'error') {
              this.loaderService.hideLoader();
              console.log("Sign in Succesfull" + res.message.hasOwnProperty('phone_number'));
              if (res.message.hasOwnProperty('user_email') && res.message.user_email[0] === 'User Email is not a valid email address.')
                this.messageService.presentErrorToast(res.message.user_email[0]);
              else if (res.message.hasOwnProperty('phone_number') && res.message.phone_number[0] === 'This Phone Number is already exist.')
                this.messageService.presentErrorToast(res.message.phone_number[0]);
              else if (res.message.hasOwnProperty('user_email') && res.message.user_email[0] === 'This email address has already been taken.')
                this.messageService.presentErrorToast(res.message.user_email[0]);
              else if (res.message.hasOwnProperty('user_firstname') && res.message.user_firstname[0] === 'First name contains only english characters and spaces')
                this.messageService.presentErrorToast(res.message.user_firstname[0]);
              else
                this.messageService.presentErrorToast(res.operation + " occured.");
            }
            else {
              this.messageService.presentErrorToast("Something went wrong.");
            }
          }
        },
        (err) => {
          if (err.hasOwnProperty('status')) {
            if (err.status == '401') {
              this.loaderService.hideLoader();
              this.messageService.presentErrorToast('Invalid Login Credentials');
            } else {
              this.loaderService.hideLoader();
              this.messageService.presentErrorToast('Something Wrong');
            }
          } else {
            this.loaderService.hideLoader();
            this.messageService.presentErrorToast('Something Wrong');
          }
        }
      );
    }
  }

  login() {
    this.route.navigate(['/login'])
  }
}
