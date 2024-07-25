import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-fmaily-members-two',
  templateUrl: './fmaily-members-two.page.html',
  styleUrls: ['./fmaily-members-two.page.scss'],
})
export class FmailyMembersTwoPage implements OnInit {

  inviteFamilyForm: FormGroup;
  userObject: any;
  token: any;
  getInviteFamilyData: any;
  showGetList = false;
  isNameValid: boolean;
  // isPhoneValid: boolean;
  memberAllowed: number

  constructor(
    private location: Location, public route: Router, private fb: FormBuilder,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private messageService: MessageService
  ) {
    this.myForm();
  }
  myForm() {
    // cno: ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.minLength(9)])],
    this.inviteFamilyForm = this.fb.group({
      name: ['', Validators.required],
      cno: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]],
      email: ['', Validators.required],
      relationship: ['', Validators.required],
    });
  }
  ionViewWillEnter() {
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    console.log('this.userObject', this.userObject);
    if (this.userObject) {
      this.token = this.userObject.token;
    }
    var data = JSON.parse(localStorage.getItem('userInfo'));
    console.log(data.package);
    if (data.package === "couple") this.memberAllowed=1
    if (data.package === "family") this.memberAllowed=4
    this.getInviteFamily();
  }

  ngOnInit() {
  }
  getInviteFamily() {
    this.apiService.getInviteFamily(this.token).subscribe((res: any) => {
      console.log(res);
      this.getInviteFamilyData = res.data;
      console.log('this.getVehicleData', this.getInviteFamilyData);
      if (res.data.length !== 0) {
        this.showGetList = true;
      }
    });
  }
  addInviteFamily() {
    if (this.inviteFamilyForm.valid) {
      const isNameValid = this.isValidName(
        this.inviteFamilyForm.get('name').value
      );
      const isPhoneValid = this.isPhoneValid(
        this.inviteFamilyForm.get('cno').value
      );
      if (isNameValid && isPhoneValid) {
        const formData = new FormData();
        formData.append('fullname', this.inviteFamilyForm.value.name);
        formData.append('phone_number', this.inviteFamilyForm.value.cno);
        formData.append('email', this.inviteFamilyForm.value.email);
        formData.append('relationship', this.inviteFamilyForm.value.relationship);
        this.loaderService.showLoader();
        this.apiService.inviteFamily(formData, this.token).subscribe((res: any) => {
          console.log(res);
          this.loaderService.hideLoader();
          if (res.hasOwnProperty('operation')) {
            if (res.operation === 'success') {
              this.loaderService.hideLoader();
              this.messageService.presentSuccessToast('invited successfully');
              this.getInviteFamily();
              this.inviteFamilyForm.reset();
              // this.route.navigate(['/invite-family-sec']);
            }
            else if (res.operation === 'error' && res.hasOwnProperty('message')) {
              this.loaderService.hideLoader();
              if (res.message.hasOwnProperty('user_email')) {
                this.messageService.presentErrorToast(res.message.user_email[0]);
              }
              else if (res.message.hasOwnProperty('phone_number')) {
                this.messageService.presentErrorToast(res.message.phone_number[0]);
              }
            }
            else if (res.operation === 'error' && res.hasOwnProperty('data')) {
              this.loaderService.hideLoader();
              this.messageService.presentErrorToast(res.data);
            }
          }
        }, (err) => {
          if (err.hasOwnProperty('status')) {
            // eslint-disable-next-line eqeqeq
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
        });
      } else if (isNameValid === false) {
        this.messageService.presentErrorToast('Name should not contain number');
      } else if (isPhoneValid === false) {
        this.messageService.presentErrorToast('Phone number is not valid.');
        return;
      }
    }
    else {
      this.messageService.presentErrorToast('Fill the required fields');
    }

  }
  viewDetailsFamily(userId, familyId) {
    console.log('userId, vehicleId', userId, familyId);
    this.route.navigate(['/edit-family-members', {
      id: familyId
    }]);
  }
  isValidName(nameString) {
    const pattern = '[0-9]';
    if (nameString.match(pattern)) {
      return false;
    }
    return nameString;
  }
  isPhoneValid(phone) {
    if (this.inviteFamilyForm.get('cno').value.toString().length > 9 ||
      this.inviteFamilyForm.get('cno').value.toString().length < 9) {
      return false;
    }
    return phone;
  }

}
