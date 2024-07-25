/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-edit-my-vehicles',
  templateUrl: './edit-my-vehicles.page.html',
  styleUrls: ['./edit-my-vehicles.page.scss'],
})
export class EditMyVehiclesPage implements OnInit {
  //Create FormGroup
  addVehiclesTwoForm: FormGroup;
  vehicleId: any;
  userObject: any;
  token: any;
  getVData: any;
  vehicleMake: any;
  vehicle_id: any;
  vehicle_expiry_date: any;
  vehicle_registration: any;
  vehicle_year: any;
  vehicle_model: any;
  expiryYear: number;
  showEditBtn = true;
  selectionChanged = false;
  constructor(
    private route: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private messageService: MessageService
  ) {
    this.myForm();
  }
  ngOnInit() {
    this.vehicleId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.token = this.userObject.token;
    }
    this.getVehicleDataById();
  }
  //Create required field validator for name
  myForm() {
    this.addVehiclesTwoForm = this.fb.group({
      vmake: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.required],
      registration: ['', Validators.required],
      date: ['', Validators.required],
    });
  }
  onChangeDetails(e) {
    if (this.selectionChanged) {
            this.showEditBtn = false;
    }
  }
  getVehicleDataById() {
    this.apiService
      .getVehicleById(this.vehicleId, this.token)
      .subscribe((res: any) => {
        this.getVData = res.data[0];
        this.vehicleMake = this.getVData.vehicle_make;
        this.vehicle_model = this.getVData.vehicle_model;
        this.vehicle_year = this.getVData.vehicle_year;
        this.vehicle_registration = this.getVData.vehicle_registration;
        this.vehicle_expiry_date = this.getVData.vehicle_expiry_date;
        this.vehicle_id = this.getVData.vehicle_id;
      });
  }
  updatevehicle() {
    if (this.addVehiclesTwoForm.valid) {
      const isDateValid = this.isValidDate(
        this.addVehiclesTwoForm.get('date').value
      );
      if (isDateValid) {
        const formData = new FormData();
        formData.append('make', this.addVehiclesTwoForm.value.vmake);
        formData.append('model', this.addVehiclesTwoForm.value.model);
        formData.append('year', this.addVehiclesTwoForm.value.year);
        formData.append(
          'registration',
          this.addVehiclesTwoForm.value.registration
        );
        formData.append('expiry_date', this.addVehiclesTwoForm.value.date);
        this.loaderService.showLoader();
        this.apiService
          .updateVehicle(formData, this.vehicleId, this.token)
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
                    '/my-vehicles',
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
      } else if (this.expiryYear < new Date().getFullYear()) {
        this.messageService.presentErrorToast(
          'Expiry year must be greater or equal to current year'
        );
      } else {
        this.messageService.presentErrorToast(
          'Please enter a valid date in "YYYY-MM-DD" format.'
        );
      }
    } else {
      this.messageService.presentErrorToast('Fill the required fields');
    }
  }
  deleteVehicleInfoById() {
    this.loaderService.showLoader();
    this.apiService.deleteVehicleInfo(this.vehicleId, this.token).subscribe(
      (res: any) => {
        this.loaderService.hideLoader();

        if (res.hasOwnProperty('operation')) {
          if (res.operation === 'success') {
            this.loaderService.hideLoader();
            this.messageService.presentSuccessToast('Deleted successfully');
            this.route.navigate([
              '/my-vehicles',
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
    if (this.expiryYear < new Date().getFullYear()) {
      return false;
    }
    return d.toISOString().slice(0, 10) === dateString;
  }
}
