import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-package-sub',
  templateUrl: './package-sub.component.html',
  styleUrls: ['./package-sub.component.scss'],
})
export class PackageSubComponent implements OnInit {
  fullName: string;
  token: any;
  userObject: any;
  subscriptionType: any

  constructor(private modalCtrl :ModalController, private apiService: ApiService,) { }

  ngOnInit() {
    
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    this.token = this.userObject.token;
    this.userInfo(this.token);
    this.ionViewDidEnter()
  }
  ionViewDidEnter() {
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.token = this.userObject.token;
      this.userInfo(this.token);
    }
    // console.log("ngOninit : " + this.userObject.token);


  }
  close() {
    this.modalCtrl.dismiss()
  }

  userInfo(token){
    console.log(token);
    this.apiService.userInfomation(token).subscribe((res: any) => {
      localStorage.setItem('userInfo', JSON.stringify(res));
      console.log("name :%%%%%%%%%%%%%%%%%%%%%%%%55  " + res.user_firstname);
      this.fullName =res.user_firstname;
      this.subscriptionType = res.user_package_type
if (this.subscriptionType == null)
this.subscriptionType = "Not Avaliable"
    });

  }

}
