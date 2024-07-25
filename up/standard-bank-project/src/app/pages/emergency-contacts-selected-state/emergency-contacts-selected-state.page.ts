import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MessageService } from 'src/app/services/message.service';


//import validator and FormBuilder
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-emergency-contacts-selected-state',
  templateUrl: './emergency-contacts-selected-state.page.html',
  styleUrls: ['./emergency-contacts-selected-state.page.scss'],
})
export class EmergencyContactsSelectedStatePage implements OnInit {
  //Create FormGroup
  emergencyContactsSelectedStateForm: FormGroup;
  userObject: any;
  token: any;
  noContact?: boolean = false;
  getEmergencyContactData: any;
  isNameValid: boolean;
  // isPhoneValid: boolean;
  isDependent: boolean = true
  constructor(private location: Location, public route: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private messageService: MessageService) {
    this.myForm();
  }
  ionViewWillEnter() {
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    const user_depended = JSON.parse(localStorage.getItem('userInfo')).user_depended;
    const user_package = JSON.parse(localStorage.getItem('userInfo')).package;
    if (user_depended === null && user_package != 'single') {
      this.isDependent = true
    }
    else {
      this.isDependent = false
    }
    if (this.userObject) {
      this.token = this.userObject.token;
    }
    this.getEmergencyContact();
  }
  ngOnInit() {
  }
  //Create required field validator for name
  myForm() {
    this.emergencyContactsSelectedStateForm = this.fb.group({
      name: ['', Validators.required],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      phone_number: ['', Validators.required],
      relationship: ['', Validators.required],
    });
  }
  goBack() {
    this.location.back();
  }
  addEmergencyContact() {
    if (this.emergencyContactsSelectedStateForm.valid) {
      const isNameValid = this.isValidName(
        this.emergencyContactsSelectedStateForm.get('name').value
      );
      const isPhoneValid = this.isPhoneValid(
        this.emergencyContactsSelectedStateForm.get('phone_number').value
      );
      if (isNameValid && isPhoneValid) {
        const formData = new FormData();
        formData.append('fullname', this.emergencyContactsSelectedStateForm.value.name);
        formData.append('phone_number', this.emergencyContactsSelectedStateForm.value.phone_number);
        formData.append('relationship', this.emergencyContactsSelectedStateForm.value.relationship);
        this.loaderService.showLoader();
        this.apiService.emergencyContact(formData, this.token).subscribe((res: any) => {
          this.loaderService.hideLoader();
          if (res.hasOwnProperty('operation')) {
            if (res.operation === 'success') {
              this.loaderService.hideLoader();
              this.messageService.presentSuccessToast('Contact added successfully');
              this.getEmergencyContact();
              this.emergencyContactsSelectedStateForm.reset();
            }
            else if (res.operation === 'error') {
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
  getEmergencyContact() {
    this.apiService.getEmergencyContact(this.token).subscribe((res: any) => {
      if (res.data.length === 0) {
        return this.noContact === true;
      }
      this.getEmergencyContactData = res.data;
    });
  }
  viewDetailsOfEmergencyContact(userId, contactId) {
    this.route.navigate(['/emergency-contacts', {
      id: contactId
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
    if (this.emergencyContactsSelectedStateForm.get('phone_number').value.toString().length > 10 ||
      this.emergencyContactsSelectedStateForm.get('phone_number').value.toString().length < 9) {
      return false;
    }
    return phone;
  }
}

