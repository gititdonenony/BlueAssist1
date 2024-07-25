import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'src/app/services/message.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-accident-details',
  templateUrl: './accident-details.page.html',
  styleUrls: ['./accident-details.page.scss'],
})
export class AccidentDetailsPage implements OnInit {
  //Create FormGroup
  accidenDetailFrom: FormGroup;

  token: any;
  userObject: any;
  getVehicleData: any[] = [];
  selectedVehicle: any;

  constructor(
    private location: Location,
    public route: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private apiService: ApiService
  ) {
    this.myForm();
  }

  //Create required field validator for name
  myForm() {
    this.accidenDetailFrom = this.fb.group({
      place: ['', Validators.required],
      doi: ['', Validators.required],
      sapsno: ['', Validators.required],
      whatHappened: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.token = this.userObject.token;
    }
    this.getVehicleList();
  }
  checkboxClick(el) {
    this.getVehicleData.map((e) => (e.isChecked = false));
    el.isChecked = true;
    this.selectedVehicle = el;
  }
  getVehicleList() {
    this.apiService.getVehicle(this.token).subscribe((res: any) => {
      this.getVehicleData = res.data;
      this.getVehicleData.map((e) => (e.isChecked = false));
    });
  }
  next() {
    if (this.accidenDetailFrom.valid && this.selectedVehicle) {
      const formData = this.accidenDetailFrom.value;
      formData.vehicle_id = this.selectedVehicle.vehicle_id;
      localStorage.setItem('roadCover-accident', JSON.stringify(formData));
      this.route.navigateByUrl('/upload-docs');
    } else {
      this.messageService.presentErrorToast(
        'Fill the required fields and Select a Vehicle'
      );
    }
  }
}
