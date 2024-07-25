/* eslint-disable @typescript-eslint/naming-convention */
import { MessageService } from './../../services/message.service';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TcComponent } from 'src/app/tc/tc.component';

@Component({
  selector: 'app-pothole',
  templateUrl: './pothole.page.html',
  styleUrls: ['./pothole.page.scss'],
})
export class PotholePage implements OnInit {
  isEnable: boolean;
  IncidentDetails = false;
  photoOfDamage = false;
  constructor(
    private modalCtrl: ModalController,
    private route: Router,
    private apiService: ApiService,
    private messageService: MessageService
  ) {
    this.route.events.subscribe((res) => {
      if (
        localStorage.getItem('pothole_images') &&
        localStorage.getItem('incident_images') &&
        localStorage.getItem('vechile_images') &&
        localStorage.getItem('incident_details')
      ) {
        this.isEnable = true;
      } else {
        this.isEnable = false;
      }
    });
  }

  ngOnInit() {
    if (
      localStorage.getItem('pothole_images') &&
      localStorage.getItem('incident_images') &&
      localStorage.getItem('vechile_images') &&
      localStorage.getItem('incident_details')
    ) {
      this.isEnable = true;
    } else {
      this.isEnable = false;
    }
  }
  ionViewWillEnter() {
    console.log(typeof localStorage.getItem('incident-photo-lenght'));
    console.log(localStorage.getItem('pothole-photo-lenght'));
    console.log(localStorage.getItem('vehicle-damage-photo-lenght'));

    if (
      localStorage.getItem('pothole_images') &&
      localStorage.getItem('incident_images') &&
      localStorage.getItem('vechile_images') &&
      localStorage.getItem('incident-photo-lenght') !== '0' &&
      localStorage.getItem('pothole-photo-lenght') !== '0' &&
      localStorage.getItem('vehicle-damage-photo-lenght') !== '0' &&
      localStorage.getItem('incident-photo-lenght') !== '-1' &&
      localStorage.getItem('pothole-photo-lenght') !== '-1' &&
      localStorage.getItem('vehicle-damage-photo-lenght') !== '-1'
    ) {
      this.photoOfDamage = true;
    }
    else {
      this.photoOfDamage = false;
    }
    if (localStorage.getItem('incident_details')) {
      this.IncidentDetails = true;
    }
  }

  incidentdetails() {
    this.route.navigate(['/incident-details']);
  }

  incidentphotos() {
    this.route.navigate(['/incident-photos']);
  }
  async submit() {
    const popover = await this.modalCtrl.create({
      component: TcComponent,
      cssClass: 'login-unlock-modal-class-d',
    });
    return await popover.present();
  }
}
