import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-one',
  templateUrl: './shop-one.page.html',
  styleUrls: ['./shop-one.page.scss'],
})
export class ShopOnePage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }
  goBack(){
    this. route. navigate(['/shop-product']);
  }
}
