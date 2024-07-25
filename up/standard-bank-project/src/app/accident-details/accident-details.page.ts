import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-accident-details',
  templateUrl: './accident-details.page.html',
  styleUrls: ['./accident-details.page.scss'],
})
export class AccidentDetailsPage implements OnInit {
  token: any;
  userObject: any;
  getVehicleData: any[] = [];
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.token = this.userObject.token;
    }
    this.getVehicleList();
  }
  getVehicleList() {
    this.apiService.getVehicle(this.token).subscribe((res: any) => {
      this.getVehicleData = res.data;
    });
  }
}
