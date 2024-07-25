import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dependentuser',
  templateUrl: './dependentuser.component.html',
  styleUrls: ['./dependentuser.component.scss'],
})
export class DependentuserComponent implements OnInit {

  constructor(
    private modalCtrl:ModalController
  ) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss()
  }
}
