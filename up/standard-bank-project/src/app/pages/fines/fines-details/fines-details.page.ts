/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fines-details',
  templateUrl: './fines-details.page.html',
  styleUrls: ['./fines-details.page.scss'],
})
export class FinesDetailsPage implements OnInit {
  finesDetailFrom: FormGroup;
  constructor(
    private route: Router,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.myForm();
  }

  ngAfterViewInit(): void {
    const data: any = JSON.parse(localStorage.getItem('fine-data'));
    this.finesDetailFrom.patchValue({
      licencePlateNo: data.vehicleRegistration,
      noticeNo: data.noticeNumber,
      amtDue: data.amountDue,
      doo: data.offenceDate,
      aarto: data.discount,
    });
  }

  ngOnInit() {}
  myForm() {
    this.finesDetailFrom = this.fb.group({
      licencePlateNo: ['', Validators.required],
      noticeNo: ['', Validators.required],
      amtDue: ['', Validators.required],
      doo: ['', Validators.required],
      aarto: ['', Validators.required],
    });
  }
  goBack() {
    this.location.back();
  }
  login() {
    this.route.navigate(['/emergency-contacts-selected-state']);
  }
}
