import { Component, OnInit, OnDestroy } from '@angular/core';

import { ArFormSubmitterService } from './ar-form-submitter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ar-form-submitter',
  templateUrl: './ar-form-submitter.page.html',
  styleUrls: ['./ar-form-submitter.page.scss'],
  providers: [
    ArFormSubmitterService
  ]
})
export class ArFormSubmitterPage implements OnInit, OnDestroy {

  buildingLottieConfig: any = {
    path: 'assets/lottie/building-form.json',
    renderer: 'canvas',
    autoplay: true,
    loop: true
  };
  emailingLottieConfig: any = {
    path: 'assets/lottie/sending-email.json',
    renderer: 'canvas',
    autoplay: true,
    loop: true
  };
  subscription: Subscription;
  progressStage = 'Building';
  progressPercentage: number;

  constructor(private service: ArFormSubmitterService) { }

  ngOnInit() {
    this.subscription = this.service.progressEventChanged().subscribe((x) => {
      this.progressStage = x.Stage;
      this.progressPercentage = x.Percentage;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ionViewDidEnter() {
    this.service.initialize();
  }

  modifyBuildAnimation(anim) {
    anim.setSpeed(2);
  }
}
