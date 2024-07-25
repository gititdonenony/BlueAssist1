import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MessageService } from 'src/app/services/message.service';
//import validator and FormBuilder
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-emergency-contacts',
  templateUrl: './emergency-contacts.page.html',
  styleUrls: ['./emergency-contacts.page.scss'],
})
export class EmergencyContactsPage implements OnInit {
  //Create FormGroup
  emergencyContactsForm: FormGroup;
  userObject: any;
  token: any;
  contactId: string;
  getEmergencyData: any;
  name: any;
  cno: any;
  relationship: any;
  isNameValid: boolean;
  // isPhoneValid: boolean;
   showEditBtn = true;
  selectionChanged = false;
  constructor(
    private location: Location,
    public route: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private messageService: MessageService
  ) {
    this.myForm();
  }

  //Create required field validator for name
  myForm() {
    this.emergencyContactsForm = this.fb.group({
      name: ['', Validators.required],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      phone_number: ['', Validators.required],
      relationship: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.contactId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    console.log('this.userObject', this.userObject);
    if (this.userObject) {
      this.token = this.userObject.token;
    }
    this.getEmergencyContactById();
  }
  onChangeDetails(e) {
    if (this.selectionChanged) {
 this.showEditBtn = false;
    }
  }
  getEmergencyContactById() {
    this.apiService
      .getEmergencyContactById(this.contactId, this.token)
      .subscribe((res: any) => {
        console.log(res);
        this.getEmergencyData = res.data[0];
        this.name = this.getEmergencyData.contact_fullname;
        this.cno = this.getEmergencyData.contact_phone_number;
        this.relationship = this.getEmergencyData.contact_relationship;
      });
  }
  updateEmergencyContact() {
    if (this.emergencyContactsForm.valid) {
      const isNameValid = this.isValidName(
        this.emergencyContactsForm.get('name').value
      );
      const isPhoneValid = this.isPhoneValid(
        this.emergencyContactsForm.get('phone_number').value
      );
      if (isNameValid && isPhoneValid) {
        const formData = new FormData();
        formData.append('fullname', this.emergencyContactsForm.value.name);
        formData.append(
          'phone_number',
          this.emergencyContactsForm.value.phone_number
        );
        formData.append(
          'relationship',
          this.emergencyContactsForm.value.relationship
        );
        this.loaderService.showLoader();
        this.apiService
          .updateEmergencyContact(formData, this.contactId, this.token)
          .subscribe(
            (res: any) => {
              console.log(res);
              this.loaderService.hideLoader();
              if (res.hasOwnProperty('operation')) {
                if (res.operation === 'success') {
                  this.loaderService.hideLoader();
                  this.messageService.presentSuccessToast(
                    'Contact updated successfully'
                  );
                  this.route.navigate([
                    '/emergency-contacts-selected-state',
                    {
                      t: new Date().getTime(),
                    },
                  ]);
                }
              }
            },
            (err) => {
              if (err.hasOwnProperty('status')) {
                // eslint-disable-next-line eqeqeq
                if (err.status == '401') {
                  this.loaderService.hideLoader();
                  this.messageService.presentErrorToast(
                    'Invalid Login Credentials'
                  );
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
      } else if (isNameValid === false) {
        this.messageService.presentErrorToast('Name should not contain number');
      } else if (isPhoneValid === false) {
        this.messageService.presentErrorToast('Phone number is not valid.');
        return;
      }
    } else {
      this.messageService.presentErrorToast('Fill the required fields');
    }
  }
  deleteEmergencyContactById() {
    this.loaderService.showLoader();
    this.apiService
      .deleteEmergencyContact(this.contactId, this.token)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.loaderService.hideLoader();
          if (res.hasOwnProperty('operation')) {
            if (res.operation === 'success') {
              this.loaderService.hideLoader();
              this.messageService.presentSuccessToast('Deleted successfully');
              this.route.navigate([
                '/emergency-contacts-selected-state',
                {
                  t: new Date().getTime(),
                },
              ]);
            }
          }
        },
        (err) => {
          if (err.hasOwnProperty('status')) {
            // eslint-disable-next-line eqeqeq
            if (err.status == '401') {
              this.loaderService.hideLoader();
              this.messageService.presentErrorToast('Something Wrong');
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
  isValidName(nameString) {
    const pattern = '[0-9]';
    if (nameString.match(pattern)) {
      return false;
    }
    return nameString;
  }
  isPhoneValid(phone) {
    if (
      this.emergencyContactsForm.get('phone_number').value.toString().length >
        10 ||
      this.emergencyContactsForm.get('phone_number').value.toString().length < 9
    ) {
      return false;
    }
    return phone;
  }
}
