import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
//import validator and FormBuilder
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-family-members',
  templateUrl: './family-members.page.html',
  styleUrls: ['./family-members.page.scss'],
})
export class FamilyMembersPage implements OnInit {
 //Create FormGroup
 requiredForm: FormGroup;

 constructor(private location: Location, public route: Router, private fb: FormBuilder) {
  this.myForm();
}

  //Create required field validator for name
  myForm() {
    this.requiredForm = this.fb.group({
      name: ['', Validators.required ],
      cno:['', Validators.required ],
      relationship:['', Validators.required ],
    });
  }
ngOnInit() {
}

}
