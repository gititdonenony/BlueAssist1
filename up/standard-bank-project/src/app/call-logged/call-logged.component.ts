import { Component, Input, OnInit } from '@angular/core';
import { NavController, MenuController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-call-logged',
  templateUrl: './call-logged.component.html',
  styleUrls: ['./call-logged.component.scss'],
})
export class CallLoggedComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}
  close() {
    this.modalCtrl.dismiss();
  }
}
