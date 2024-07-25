import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-start-your-accident-report',
  templateUrl: './start-your-accident-report.component.html',
  styleUrls: ['./start-your-accident-report.component.scss'],
})
export class StartYourAccidentReportComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {

  }

  close(){
    this.modalCtrl.dismiss();
  }
  ngOnInit() {}


}
