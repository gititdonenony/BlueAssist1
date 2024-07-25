import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-shakealert',
  templateUrl: './shakealert.component.html',
  styleUrls: ['./shakealert.component.scss'],
})
export class ShakealertComponent implements OnInit {
  togglestatus;
  constructor(
    private modalCtrl: ModalController,
    private route: Router
  ) { }

  close(){
    this.togglestatus = false;
    this.modalCtrl.dismiss(this.togglestatus);
  }
  ngOnInit() {}

  lockshop() {
    this.togglestatus = true;
    this.modalCtrl.dismiss(this.togglestatus);
  }
}
