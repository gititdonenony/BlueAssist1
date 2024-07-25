import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-licence-cart',
  templateUrl: './licence-cart.page.html',
  styleUrls: ['./licence-cart.page.scss'],
})
export class LicenceCartPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
  goBack() {
    this.location.back();
  }


}
