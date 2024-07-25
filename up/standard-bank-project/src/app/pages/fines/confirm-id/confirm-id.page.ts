import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-confirm-id',
  templateUrl: './confirm-id.page.html',
  styleUrls: ['./confirm-id.page.scss'],
})
export class ConfirmIdPage implements OnInit {
  confirmFinesIdForm: FormGroup;
  constructor(
    private route: Router,
    private fb: FormBuilder,
    private location: Location,
    private messageService: MessageService
  ) {
    this.myFrom();
  }

  ngOnInit() {
  }
  myFrom(){
    this.confirmFinesIdForm = this.fb.group({
      id: ['', Validators.required],
    });
  }
  fetchFines(){
    if(this.confirmFinesIdForm.valid){
      const formData = new FormData();
      formData.append('id', this.confirmFinesIdForm.value.id);
      this.route.navigate(['traffic-fines',  { state: this.confirmFinesIdForm.value.id }]);
    }else{
      this.messageService.presentErrorToast('somthing went wrong');
    }
  }
  goBack() {
    this.location.back();
  }
}
