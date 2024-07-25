import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finish-home',
  templateUrl: './finish-home.page.html',
  styleUrls: ['./finish-home.page.scss'],
})
export class FinishHomePage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }
  finishHome(){
    console.log("Finish Home not right now");

    this.route.navigate(['/tabs/profile', { markerStatus: '2' }]);

  }

}
