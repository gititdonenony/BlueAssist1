import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.page.html',
  styleUrls: ['./my-details.page.scss'],
})
export class MyDetailsPage implements OnInit {

  isDependent = true
  constructor(private route: Router,
    private storage: Storage,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    const user_depended = JSON.parse(localStorage.getItem('userInfo')).user_depended;
    const user_package = JSON.parse(localStorage.getItem('userInfo')).package;
    console.log(user_depended);

    if (user_depended === null && user_package != 'single') {
      this.isDependent = true
    }
    
    else {
      this.isDependent = false
    }
  }
  nextBtn() {
    // this.route.navigate(['/tabs/profile']);
    this.route.navigate(['/tabs/profile', { markerStatus: '2' }]);

  }

  async addOtherMembers() {
    var userinfo = await this.storage.get("userInfo");
    console.log(JSON.parse(userinfo).package);
    var packageDetails = JSON.parse(userinfo).package

    if (packageDetails === 'couple' || packageDetails === 'family') {
      this.route.navigate(['/fmaily-members-two']);
    }
    else if (packageDetails === 'single') {
      console.log("cant go in");
      // this.messageService.presentErrorToast("Subscribe package to add family members");
      this.messageService.presentErrorToast("You are not able to invite family member");

    }


  }
}
