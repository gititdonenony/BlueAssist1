import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-upgrade-package',
  templateUrl: './upgrade-package.page.html',
  styleUrls: ['./upgrade-package.page.scss'],
})
export class UpgradePackagePage implements OnInit {

  constructor( private location: Location ) {
  }

  ngOnInit() {
  }
  goBack() {
    this.location.back();
  }

}
