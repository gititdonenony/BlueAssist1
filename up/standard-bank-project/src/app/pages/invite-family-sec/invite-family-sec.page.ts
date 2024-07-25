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
  selector: 'app-invite-family-sec',
  templateUrl: './invite-family-sec.page.html',
  styleUrls: ['./invite-family-sec.page.scss'],
})
export class InviteFamilySecPage implements OnInit {
  //Create FormGroup
  inviteFamilySecForm: FormGroup;
  familyId: any;
  userObject: any;
  token: any;
  getfamilyData: any;
  relationship: any;
  cno: any;
  name: any;
  isNameValid: boolean;
  showEditBtn = true;
  selectionChanged = false;
  email: any
  memberAllowed: any
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
    this.inviteFamilySecForm = this.fb.group({
      name: ['', Validators.required],
      cno: ['', Validators.required],
      relationship: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.familyId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.token = this.userObject.token;
    }
    this.getInviteFamilyById();
  }
  onChangeDetails(e) {
    if (this.selectionChanged) {
      this.showEditBtn = false;
    }
  }


  ionViewWillEnter() {
    var data = JSON.parse(localStorage.getItem('userInfo'));
    console.log(data.package);
    if (data.package === "couple") this.memberAllowed = 1
    if (data.package === "family") this.memberAllowed = 4
  }
  getInviteFamilyById() {
    this.apiService
      .getInviteFamilyById(this.familyId, this.token)
      .subscribe((res: any) => {
        this.getfamilyData = res.data[0];
        this.name = this.getfamilyData.family_fullname;
        this.cno = this.getfamilyData.family_phone_number;
        this.email = this.getfamilyData.family_email;
        this.relationship = this.getfamilyData.family_relationship;
      });
  }
  updateInviteFamily() {
    if (this.inviteFamilySecForm.valid) {
      const isNameValid = this.isValidName(
        this.inviteFamilySecForm.get('name').value
      );
      const isPhoneValid = this.isPhoneValid(
        this.inviteFamilySecForm.get('cno').value
      );
      if (isNameValid && isPhoneValid) {
        const formData = new FormData();
        formData.append('fullname', this.inviteFamilySecForm.value.name);
        formData.append('phone_number', this.inviteFamilySecForm.value.cno);
        formData.append(
          'relationship',
          this.inviteFamilySecForm.value.relationship
        );
        this.loaderService.showLoader();
        this.apiService
          .updateInviteFamily(formData, this.familyId, this.token)
          .subscribe(
            (res: any) => {
              this.loaderService.hideLoader();
              if (res.hasOwnProperty('operation')) {
                if (res.operation === 'success') {
                  this.loaderService.hideLoader();
                  this.messageService.presentSuccessToast(
                    'Updated successfully'
                  );
                  this.route.navigate([
                    '/invite-family',
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
  deleteInviteFamilyById() {
    this.loaderService.showLoader();
    this.apiService.deleteInviteFamily(this.familyId, this.token).subscribe(
      (res: any) => {
        this.loaderService.hideLoader();

        if (res.hasOwnProperty('operation')) {
          if (res.operation === 'success') {
            this.loaderService.hideLoader();
            this.messageService.presentSuccessToast('Deleted successfully');
            this.route.navigate([
              '/invite-family',
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
      this.inviteFamilySecForm.get('cno').value.toString().length > 10 ||
      this.inviteFamilySecForm.get('cno').value.toString().length < 9
    ) {
      return false;
    }
    return phone;
  }
}
