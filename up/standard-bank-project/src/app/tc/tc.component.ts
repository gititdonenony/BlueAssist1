/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, MenuController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { MessageService } from '../services/message.service';
@Component({
  selector: 'app-tc',
  templateUrl: './tc.component.html',
  styleUrls: ['./tc.component.scss'],
})
export class TcComponent implements OnInit {


  rafNum: any
  constructor(
    private route: Router,
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private messageService: MessageService
  ) { }

  ngOnInit() { }

  close() {
    this.modalCtrl.dismiss();
    this.route.navigate(['/incident-photos']);
  }

  nextBtn() {
    this.modalCtrl.dismiss();
    const pothole = JSON.parse(localStorage.getItem('pothole_images'));
    const incident = JSON.parse(localStorage.getItem('incident_images'));
    const vehicle = JSON.parse(localStorage.getItem('vechile_images'));
    const formData = JSON.parse(localStorage.getItem('incident_details'));
    const payload = {
      vehicle_id: formData.vehicle_id,
      incident_where: formData.place,
      incident_date: formData.doi,
      incident_sapsno: formData.sapsno,
      incident_whathappened: formData.describe,
      pothole_img1: pothole[0] ? pothole[0].name : null,
      pothole_img2: pothole[1] ? pothole[1].name : null,
      pothole_img3: pothole[2] ? pothole[2].name : null,
      pothole_img4: pothole[3] ? pothole[3].name : null,
      incident_img1: incident[0] ? incident[0].name : null,
      incident_img2: incident[1] ? incident[1].name : null,
      incident_img3: incident[2] ? incident[2].name : null,
      incident_img4: incident[3] ? incident[3].name : null,
      vehicle_img1: vehicle[0] ? vehicle[0].name : null,
      vehicle_img2: vehicle[1] ? vehicle[1].name : null,
      vehicle_img3: vehicle[2] ? vehicle[2].name : null,
      vehicle_img4: vehicle[3] ? vehicle[3].name : null,
    };
    this.apiService.incidentPost(payload).subscribe(
      (res: any) => {
        if (res.operation === 'success') {
          console.log(res.data.ref);
          this.rafNum = res.data.ref
          this.messageService.presentSuccessToast('Claim Submitted');
          localStorage.removeItem('incident_details');
          localStorage.removeItem('incident_images');
          localStorage.removeItem('pothole_images');
          localStorage.removeItem('vechile_images');
          localStorage.setItem('incident-photo-lenght', '' + 0);
          localStorage.setItem('pothole-photo-lenght', '' + 0);
          localStorage.setItem('vehicle-damage-photo-lenght', '' + 0);
          this.route.navigate(['/finish', { rafNumber: this.rafNum }]);
        }
      },
      (err) => {
        this.messageService.presentErrorToast('Error while Submitting Claim');
      }
    );
    // this.route.navigate(['/finish']);


  }

}
