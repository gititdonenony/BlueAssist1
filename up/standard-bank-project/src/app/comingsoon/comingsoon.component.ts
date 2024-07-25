import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-comingsoon',
  templateUrl: './comingsoon.component.html',
  styleUrls: ['./comingsoon.component.scss'],
})
export class ComingsoonComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController,

  ) { }

  ngOnInit() { }

  close() {
    this.modalCtrl.dismiss()
  }
}

