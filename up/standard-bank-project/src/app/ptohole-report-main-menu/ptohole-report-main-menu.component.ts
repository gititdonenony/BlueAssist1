import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, MenuController, ModalController } from '@ionic/angular';
import { TcComponent } from './../tc/tc.component';

@Component({
  selector: 'app-ptohole-report-main-menu',
  templateUrl: './ptohole-report-main-menu.component.html',
  styleUrls: ['./ptohole-report-main-menu.component.scss'],
})
export class PtoholeReportMainMenuComponent implements OnInit {


  constructor( private route: Router,private modalCtrl: ModalController) {}


  close(){
    this.modalCtrl.dismiss();
  }
  ngOnInit() {}
  incidentdetails(){
    this.modalCtrl.dismiss();
    this.route.navigate(['/incident-details']);
  }

  incidentphotos(){
    this.modalCtrl.dismiss();
    this.route.navigate(['/incident-photos']);
  }
  async lockshop(lockdeta) {
    this.modalCtrl.dismiss();
    const popover = await this.modalCtrl.create({
      component: TcComponent,
      cssClass: 'login-unlock-modal-class',
    });
    return await popover.present();
  }


}
