/* eslint-disable eqeqeq */
/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
//import validator and FormBuilder
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-medical-information',
  templateUrl: './medical-information.page.html',
  styleUrls: ['./medical-information.page.scss'],
})
export class MedicalInformationPage implements OnInit {

  //Create FormGroup
  medicalInformationForm: FormGroup;
  userObject: any;
  token: any;
  firstname: any;
  phoneNumber: any;
  lastname: any;
  additionalInformation: any;
  medicalCondition: any;
  showEditBtn = true;
  selectionChanged = false;
  constructor(private fb: FormBuilder,
    public route: Router,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private messageService: MessageService) {
    this.myForm();
  }
  //Create required field validator for name
  myForm() {
    this.medicalInformationForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      cno: ['', Validators.required],
      email: ['', Validators.required],
      addinfo: ['', Validators.required],
      // phone: ['', Validators.required],
      // name: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.token = this.userObject.token;
    }
    this.getMedicalInfo();
    this.userInfo(this.token);
  }
  // onChangeDetails(e) {
  //   if (this.selectionChanged) {
  //this.showEditBtn = false;
  //   }
  // }
  userInfo(token){
    this.apiService.userInfomation(token).subscribe((res: any) => {
      this.firstname = res.user_firstname;
      this.lastname = res.user_lastname;
      this.phoneNumber = res.phone_number;
      this.additionalInformation = res.user_additional_information;
      if(this.additionalInformation == null){
        this.additionalInformation = '';
      }
      this.medicalCondition = res.user_medical_condition;
      if(this.medicalCondition == null){
        this.medicalCondition = '';
      }
    });
  }
  getMedicalInfo(){
    this.apiService.getMedicalInfo(this.token).subscribe((res: any) => {
    });
  }
  addMedicalInfo() {
   if(this.medicalInformationForm.value.email == null || this.medicalInformationForm.value.email == ''){
      this.messageService.presentErrorToast('Medical condition is required');
    }else if(this.medicalInformationForm.value.addinfo == null || this.medicalInformationForm.value.addinfo == ''){
      this.messageService.presentErrorToast('Additional Information is required');
    }
    else {
      const formData = new FormData();
      formData.append('medical_condition', this.medicalInformationForm.value.email);
      formData.append('additional_information', this.medicalInformationForm.value.addinfo);
        this.loaderService.showLoader();
        this.apiService.updateMedicalInfo(formData, this.token).subscribe((res: any) => {
          this.loaderService.hideLoader();
          if (res.hasOwnProperty('operation')) {
            if (res.operation === 'success') {
              this.loaderService.hideLoader();
              this.messageService.presentSuccessToast('Information added successfully');
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
    }
    }

}
