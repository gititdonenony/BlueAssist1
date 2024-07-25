import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
//import validator and FormBuilder
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MessageService } from 'src/app/services/message.service';
import { ProfilePage } from '../../tabs/profile/profile.page';
import { PhotogalleryComponent } from 'src/app/component/photogallery/photogallery.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-personal-info-my-details',
  templateUrl: './personal-info-my-details.page.html',
  styleUrls: ['./personal-info-my-details.page.scss'],
})
export class PersonalInfoMyDetailsPage implements OnInit {
  //Create FormGroup
  requiredForm: FormGroup;
  userObject: any;
  firstName: string;
  lastName: string;
  // idNo: any;
  fullName: string;
  email: string;
  token: any;
  photos: any[];
  base64Response: any;
  profileImage: string;
  showImage = false;
  profileImageName: any;
  phoneNumber: any;
  homeAddress: any;
  workAddress: any;
  profilePath: any;
  isFNameValid: boolean;
  showEditBtn = true;
  selectionChanged = false;
  // isPhoneValid: boolean;
  constructor(
    private route: Router,
    private fb: FormBuilder,
    private location: Location,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private markerSet: ProfilePage,
    private modalCtrl: ModalController,

  ) {
    this.requiredForm = this.fb.group({
      fullname: ['', Validators.required],
      // idNo: ['', Validators.required],
      contactNo: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
        ],
      ],
      address: ['', Validators.required],
      workAddress: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    console.log('this.userObject', this.userObject);
    if (this.userObject) {
      // this.firstName = this.userObject.fname;
      // this.lastName = this.userObject.lname;
      // this.fullName = this.userObject.fname + ' ' + this.userObject.lname;
      // this.idNo = this.userObject.id_number;
      // this.email = this.userObject.email;
      this.token = this.userObject.token;
    }
    this.userInfo(this.token);
  }
  onChangeDetails(e) {
    if (this.selectionChanged) {
      this.showEditBtn = false;
    }
  }

  goBack() {
    // window.history.back();
    this.location.back();
    console.log('goBack()...');
  }
  mydetails() {
    this.route.navigate(['/my-details']);
  }
  // async captureImage() {
  //   // this.photos = [];
  //   const image = await Camera.getPhoto({
  //     quality: 30,
  //     allowEditing: false,
  //     resultType: CameraResultType.Base64,
  //     source: CameraSource.Prompt,
  //     saveToGallery: false,
  //   });
  //   const body = {
  //     imageFile: image.base64String.toString(),
  //     imageType: image.format,
  //   };
  //   this.loaderService.showLoader();
  //   this.apiService.imageBase64Upload(body, this.token).subscribe((data) => {
  //     console.log('data', data);
  //     this.loaderService.hideLoader();
  //     this.base64Response = data;
  //     this.profileImageName = this.base64Response.data.imagename;
  //     this.profileImage = this.base64Response.data.imagepath;
  //     console.log('this.profileImage', this.profileImage);
  //     if (this.profileImage !== '') {
  //       this.showImage = true;
  //     }
  //   });
  // }

  
  async captureImage() {
    const popover = await this.modalCtrl.create({
      component: PhotogalleryComponent,
      cssClass: 'login-unlock-modal-class-d',
    });
    await popover.present();
    const image = await popover.onDidDismiss();
    if (image.data.mode === "undefined") {
      this.messageService.presentErrorToast("Please try again.")
    }
    else if (image.data.mode === 'camera' && image.data.imageFile !== "") {
      const body = {
        imageFile: image.data.imageFile,
        imageType: image.data.imageType,
      };
      this.postImageUplaod(body)
    }
    else if (image.data.mode === 'gallery' && image.data.imageFile !== "" && (image.data.imageType === 'jpeg' || image.data.imageType === 'jpg' || image.data.imageType === 'png')) {
      const body = {
        imageFile: image.data.imageFile,
        imageType: image.data.imageType,
      };
      this.postImageUplaod(body)
    }
    else if (image.data.mode === 'gallery' && image.data.imageFile !== "" && (image.data.imageType !== 'jpeg' || image.data.imageType !== 'jpg' || image.data.imageType !== 'png')) {
      this.messageService.presentErrorToast("Only images can be uplaod.")
    } else {
      this.messageService.presentErrorToast("somthing went wrong!!! PLease try again.")
    }
    console.log(image.data.mode);
    console.log(image.data.imageFile);
    console.log(image.data.imageType);

  }

  postImageUplaod(body) {
    this.loaderService.showLoader();
    this.apiService.imageBase64Upload(body, this.token).subscribe((data) => {
      this.loaderService.hideLoader();
      this.base64Response = data;
      this.profileImageName = this.base64Response.data.imagename;
      this.profileImage = this.base64Response.data.imagepath;
      if (this.profileImage !== '') {
        this.showImage = true;
      }
    });
  }

  userInfo(token) {
    this.apiService.userInfomation(token).subscribe((res: any) => {
      console.log(res);
      this.fullName = res.user_firstname;
      // this.idNo = res.id_number;
      this.email = res.user_email;
      this.phoneNumber = res.phone_number;
      this.profilePath = res.image_full_path;
      this.profileImageName = res.profile_image;
      if (this.profilePath !== '' && this.profileImageName !== '' && this.profileImageName !== null) {
        this.profileImage = this.profilePath + this.profileImageName;
        console.log("profile image  : " + this.profileImage);
        this.showImage = true;
      }
      this.homeAddress = res.home_address;
      this.workAddress = res.work_address;
    });
  }

  updateInfo() {
    if (this.profileImageName === undefined) {
      this.profileImageName = '';
    }
    if (this.requiredForm.value.fullname === undefined) {
      this.requiredForm.value.fullname = '';
    }
    if (this.requiredForm.value.contactNo === undefined) {
      this.requiredForm.value.contactNo = '';
    }
    if (this.requiredForm.value.address === undefined) {
      this.requiredForm.value.address = '';
    }
    if (this.requiredForm.value.workAddress === undefined) {
      this.requiredForm.value.workAddress = '';
    }
    if (this.requiredForm.valid) {
      const isNameValid = this.isValidName(
        this.requiredForm.get('fullname').value
      );
      const isPhoneValid = this.isPhoneValid(
        this.requiredForm.get('contactNo').value
      );
      if (isNameValid && isPhoneValid) {
        const formData = new FormData();
        formData.append('fullname', this.requiredForm.value.fullname);
        formData.append('phone_number', this.requiredForm.value.contactNo);
        formData.append('home_address', this.requiredForm.value.address);
        formData.append('work_address', this.requiredForm.value.workAddress);
        formData.append('profile_image', this.profileImageName);

        this.loaderService.showLoader();
        this.apiService.updateProfile(formData, this.token).subscribe(
          (res: any) => {
            console.log(res);
            if (res.hasOwnProperty('operation')) {
              if (res.operation === 'success') {
                this.loaderService.hideLoader();
                localStorage.setItem('userInfoData', JSON.stringify(res));
                console.log(JSON.stringify(res.data));
                
                localStorage.setItem('userInfo', JSON.stringify(res.data));
                this.markerSet.setMapMarker()
                this.messageService.presentSuccessToast(
                  'Your information updated successfully'
                );
                this.route.navigate(['my-details']);
              }
            }
            this.loaderService.hideLoader();
          },
          (err) => {
            if (err.hasOwnProperty('status')) {
              if (err.status === '401') {
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

  isValidName(nameString) {
    const pattern = '[0-9]';
    if (nameString.match(pattern)) {
      return false;
    }
    return nameString;
  }
  isPhoneValid(phone) {
    if (
      this.requiredForm.get('contactNo').value.toString().length > 10 ||
      this.requiredForm.get('contactNo').value.toString().length < 9
    ) {
      return false;
    }
    return phone;
  }
}
