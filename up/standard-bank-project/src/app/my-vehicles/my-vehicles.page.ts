import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import validator and FormBuilder
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MessageService } from 'src/app/services/message.service';
@Component({
  selector: 'app-my-vehicles',
  templateUrl: './my-vehicles.page.html',
  styleUrls: ['./my-vehicles.page.scss'],
})
export class MyVehiclesPage implements OnInit {

  addVehicleForm: FormGroup;
  userObject: any;
  token: any;
  getVehicleData: any;
  showGetList = false;
  expiryYear: number;
  constructor(
    private route: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private messageService: MessageService
  ) {
    this.myForm();
  }
  ionViewWillEnter() {
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.token = this.userObject.token;
    }
    this.getVehicleList();
  }
  ngOnInit() {}
  //Create required field validator for name
  myForm() {
    this.addVehicleForm = this.fb.group({
      vmake: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.required],
      registration: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  nextBtn() {
    this.route.navigate(['/home']);
  }
  mydetail(){
    this.route.navigate(['/tabs/profile']);

  }
  getVehicleList() {
    this.apiService.getVehicle(this.token).subscribe((res: any) => {
      this.getVehicleData = res.data;
      if (res.data.length !== 0) {
        this.showGetList = true;
      }
    });
  }

  addvehicle() {
    if (this.addVehicleForm.valid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      const isDateValid = this.isValidDate(
        this.addVehicleForm.get('date').value
      );
      if (isDateValid) {
        const formData = new FormData();
        formData.append('make', this.addVehicleForm.value.vmake);
        formData.append('model', this.addVehicleForm.value.model);
        formData.append('year', this.addVehicleForm.value.year);
        formData.append('registration', this.addVehicleForm.value.registration);
        formData.append('expiry_date', this.addVehicleForm.value.date);
        this.loaderService.showLoader();
        this.apiService.vehicle(formData, this.token).subscribe(
          (res: any) => {
            this.loaderService.hideLoader();
            if (res.hasOwnProperty('operation')) {
              if (res.operation === 'success') {
                this.loaderService.hideLoader();
                this.messageService.presentSuccessToast('Vehicle added successfully');
                this.getVehicleList();
                this.addVehicleForm.reset();
              } else if (res.operation === 'error') {
                this.loaderService.hideLoader();
                this.messageService.presentErrorToast(res.data);
              }
            }
          },
          (err) => {
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
          }
        );
      }else if (this.expiryYear <  new Date().getFullYear()){
        this.messageService.presentErrorToast('Expiry year must be greater or equal to current year');
      }else {
        this.messageService.presentErrorToast(
          'Please enter a valid date in "YYYY-MM-DD" format.'
        );
      }
    }else {
      this.messageService.presentErrorToast('Fill the required fields');
    }
  }
  viewDetailsVehicle(userId, vehicleId) {
    this.route.navigate([
      '/edit-my-vehicles',
      {
        id: vehicleId,
      },
    ]);
  }

  isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) {
      return false;
    }
    const d = new Date(dateString);
    this.expiryYear = d.getFullYear();
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) {
      return false;
    }
    if (this.expiryYear <  new Date().getFullYear()){
      return false;
    }
    return d.toISOString().slice(0, 10) === dateString;
  }
}
