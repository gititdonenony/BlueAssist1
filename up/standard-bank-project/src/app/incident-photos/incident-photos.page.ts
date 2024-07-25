import { Component, OnInit } from '@angular/core';
import { TcComponent } from './../tc/tc.component';
import { NavController, MenuController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-incident-photos',
  templateUrl: './incident-photos.page.html',
  styleUrls: ['./incident-photos.page.scss'],
})
export class IncidentPhotosPage implements OnInit {
  incidentScence = false;
  potholeRoadScence = false;
  potholeVehicleDamageScence = false;

  constructor(
    private route: Router,
    private modalCtrl: ModalController,
    private location: Location
  ) { }
  ngOnInit() { }
  ionViewWillEnter() {
    console.log(localStorage.getItem('incident-photo-lenght'));
    console.log(typeof localStorage.getItem('incident-photo-lenght'));

    if (localStorage.getItem('incident-photo-lenght') === '1' ||
      localStorage.getItem('incident-photo-lenght') === '2' ||
      localStorage.getItem('incident-photo-lenght') === '3' ||
      localStorage.getItem('incident-photo-lenght') === '4'
    ) {
      this.incidentScence = true;
    } if (localStorage.getItem('incident-photo-lenght') === '0' || localStorage.getItem('incident-photo-lenght') === '-1') {
      console.log("incidentScence : " + this.incidentScence);

      this.incidentScence = false;
    }
    if (localStorage.getItem('pothole-photo-lenght') === '1' ||
      localStorage.getItem('pothole-photo-lenght') === '2' ||
      localStorage.getItem('pothole-photo-lenght') === '3' ||
      localStorage.getItem('pothole-photo-lenght') === '4') {
      this.potholeRoadScence = true;
    } if (localStorage.getItem('pothole-photo-lenght') === '0' || localStorage.getItem('pothole-photo-lenght') === '-1') {
      this.potholeRoadScence = false;
    }
    if (localStorage.getItem('vehicle-damage-photo-lenght') === '1' ||
      localStorage.getItem('vehicle-damage-photo-lenght') === '2' ||
      localStorage.getItem('vehicle-damage-photo-lenght') === '3' ||
      localStorage.getItem('vehicle-damage-photo-lenght') === '4') {
      this.potholeVehicleDamageScence = true;
    } if (localStorage.getItem('vehicle-damage-photo-lenght') === '0' || localStorage.getItem('vehicle-damage-photo-lenght') === '-1') {
      this.potholeRoadScence = false;
    }
  }

  tc() {
    this.route.navigate(['/pothole']);
  }

  goBack() {
    this.location.back();
  }
  getIncident() {
    this.route.navigate(['/incident-scene-photos']);
  }
  roadScene() {
    this.route.navigate(['/pothole-road-scene-photos']);
  }
  vehicleDamage() {
    this.route.navigate(['/pothole-vehicle-damage-photos']);
  }
}
