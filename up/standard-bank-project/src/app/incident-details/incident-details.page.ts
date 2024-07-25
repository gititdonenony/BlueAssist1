import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-incident-details',
  templateUrl: './incident-details.page.html',
  styleUrls: ['./incident-details.page.scss'],
})
export class IncidentDetailsPage implements OnInit {
  incidentdetailform: FormGroup;
  getVehicleData: any;
  showGetList: boolean;
  userObject: any;
  token: any;
  selectedVehicle: any;
  vehicleLength: any;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private route: Router,
    private messageService: MessageService,
    private apiService: ApiService
  ) {
    this.formVlidation();
    const formData = JSON.parse(localStorage.getItem('incident_details'));
    if (formData) {
      this.incidentdetailform.patchValue({
        place: formData.place,
        doi: formData.doi,
        sapsno: formData.sapsno,
        describe: formData.describe,
      });
    }
  }

  ngOnInit() {
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.token = this.userObject.token;
    }
    this.getVehicleList();
  }
  formVlidation() {
    this.incidentdetailform = this.fb.group({
      place: ['', Validators.required],
      doi: ['', Validators.required],
      sapsno: ['', Validators.required],
      describe: ['', Validators.required],
    });
  }
  getVehicleList() {
    const data = JSON.parse(localStorage.getItem('incident_details'));
    this.apiService.getVehicle(this.token).subscribe((res: any) => {console.log(res);
      if (res.data.length) {
        res.data.map((item) => {
          if (data?.vehicle_id === item.vehicle_id) {
            item.isChecked = true;
          } else {
            item.isChecked = false;
          }
        });
      }
      this.getVehicleData = res.data;
      this.vehicleLength = res.data.length;
      if (res.data.length !== 0) {
        this.showGetList = true;
      }
      if (res.data.length === 1) {
        this.selectVehicle(res.data[0]);
      }
    });
  }

  incidenDetail() {
    if (!this.selectedVehicle) {
      this.messageService.presentErrorToast('Please select a vehicle');
      return;
    }
    const formData = this.incidentdetailform.value;
    if (this.incidentdetailform.valid) {
      formData.vehicle_id = this.selectedVehicle.vehicle_id;
      localStorage.setItem('incident_details', JSON.stringify(formData));
      this.route.navigateByUrl('/pothole');
    } else {
      this.messageService.presentErrorToast('Fill the required fields');
    }
  }
  selectVehicle(item) {
    this.selectedVehicle = item;
    this.getVehicleData.map((each) => {
      if (item.vehicle_id === each.vehicle_id) {
        each.isChecked = true;
      } else {
        each.isChecked = false;
      }
    });
    item.isChecked = true;
  }
  goBack() {
    this.location.back();
  }
}
