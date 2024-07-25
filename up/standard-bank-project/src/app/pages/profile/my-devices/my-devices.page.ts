import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import validator and FormBuilder
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-my-devices',
  templateUrl: './my-devices.page.html',
  styleUrls: ['./my-devices.page.scss'],
})
export class MyDevicesPage implements OnInit {
//Create FormGroup
requiredForm: FormGroup;

constructor( private route: Router,private modalCtrl: ModalController,private fb: FormBuilder) {
  this.myForm();
}

   //Create required field validator for name
   myForm() {
    this.requiredForm = this.fb.group({
      vmake:['', Validators.required ],
      model: ['', Validators.required ],
      year:['', Validators.required ],
      registration:['', Validators.required ],
    });
  }

  ngOnInit() {
  }
  nextBtn(){
    this. route. navigate(['/tabs/profile']);
  }


}
