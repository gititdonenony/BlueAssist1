import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-upgradepackagesidebar',
  templateUrl: './upgradepackagesidebar.component.html',
  styleUrls: ['./upgradepackagesidebar.component.scss'],
})
export class UpgradepackagesidebarComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss()
  }

}
