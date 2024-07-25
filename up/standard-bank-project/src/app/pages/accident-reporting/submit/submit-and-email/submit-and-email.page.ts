import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubmitEmail } from 'src/app/pages/tabs/Model/claim.model';

import { SubmitAndEmailService } from './submit-and-email.service';
import { MessageBusService } from 'src/app/services/messagebus.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-submit-and-email',
  templateUrl: './submit-and-email.page.html',
  styleUrls: ['./submit-and-email.page.scss'],
  providers: [
    SubmitAndEmailService
  ]
})
export class SubmitAndEmailPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };
  submissionForm: FormGroup;
  _submitEmail: SubmitEmail;

  dateTime
  selectedDate
  selectedTime=""
  constructor(private service: SubmitAndEmailService,
    private messageBus: MessageBusService,
    private global: GlobalService,

  ) {
    this._submitEmail = new SubmitEmail();
    console.log(this._submitEmail.accident_occurdate);

  }

  ngOnInit() {
    this.submissionForm = this.service.buildForm();
    // setTimeout(() => {
    this.dateTime = this.service.returnCureentDate();
    // console.log(this.dateTime);

    // });
    console.log(this.dateTime);

  }

  ionViewWillLeave() {
    const completionState = this.submissionForm.valid ? 2 : 1;
    this.service.broadcastCompletionState(completionState);
  }

  async backClicked() {
    this._submitEmail.accident_occurdate = ""
    this._submitEmail.accident_occurtime = ""
    this._submitEmail.email_sendto = ""
    this.service.clearForm();
    await this.service.finish(true);
  }


  timeChanged() {
    console.log("time chnaged"+this.selectedTime);
    
    this.selectedTime = this.selectedTime.slice(11,0)
    console.log("time chnaged"+this.selectedTime);

    // mobileorPhone.slice(0, 3).toLowerCase();
  }
  async nextClicked() {
    console.log();

    //console.log(this.submissionForm,'from submit')
    this._submitEmail.accident_occurdate = this.submissionForm.controls.AccidentDate.value;
    // this._submitEmail.accident_occurdate = this.selectedDate;
    this._submitEmail.accident_occurtime = this.submissionForm.controls.AccidentTime.value;
    this._submitEmail.email_sendto = this.submissionForm.controls.Email.value;
    console.log(this._submitEmail);
    if (this._submitEmail.email_sendto === "" || this._submitEmail.email_sendto === null) {
      await this.global.toast("Please enter a valid email address");
    }
    else if (this._submitEmail.accident_occurdate === null || this._submitEmail.accident_occurdate === "") {
      await this.global.toast("Please select a date");
    }
    // else if (this._submitEmail.accident_occurtime === null || this._submitEmail.accident_occurtime === "") {
    //   await this.global.toast("Please select a time");
    // }
    else {
      await this.service.finish(false);
      this.service.SaveSubmitEmail(this._submitEmail);
      this.service.clearForm()
      this._submitEmail.accident_occurdate = ""
      this._submitEmail.accident_occurtime = ""
      this._submitEmail.email_sendto = ""
    }
  }


}
