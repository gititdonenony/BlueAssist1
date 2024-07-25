import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-shop-cart',
  templateUrl: './shop-cart.page.html',
  styleUrls: ['./shop-cart.page.scss'],
})
export class ShopCartPage implements OnInit {

  constructor(private route: Router
    , private location: Location ) {
     }

     ngOnInit() {
     }
     arrowBack() {
       this.location.back();
     }

}
