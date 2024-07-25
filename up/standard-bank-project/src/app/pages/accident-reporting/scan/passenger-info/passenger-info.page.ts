import { Component, OnInit, OnDestroy } from '@angular/core';

import { PassengerInfoService } from './passenger-info.service';
import { IPassenger } from '../../../../services/models.service';

@Component({
  selector: 'app-passenger-info',
  templateUrl: './passenger-info.page.html',
  styleUrls: ['./passenger-info.page.scss'],
  providers: [
    PassengerInfoService
  ]
})
export class PassengerInfoPage implements OnInit, OnDestroy {

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  passengers: IPassenger[] = [];
  type = '';

  shouldContinueWithJourney = false;

  constructor(private service: PassengerInfoService) { }

  async ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    this.type = urlParams.get('type');
    this.passengers = await this.service.initialize(this.type);
  }

  ngOnDestroy() {
    const state = this.calculateCompletionState();
    this.service.broadcastState(state, this.shouldContinueWithJourney);
  }

  async backClicked() {
    await this.service.finish(true);
  }

  async nextClicked() {
    this.shouldContinueWithJourney = await this.service.finish(false);
  }

  async addPassenger() {
    await this.service.launchPassengerInfoPage();
  }

  async editPassenger(passenger: IPassenger) {
    await this.service.launchPassengerInfoPage(passenger);
  }

  async removePassenger(event: Event, passenger: IPassenger) {
    event.preventDefault();
    event.stopPropagation();
    await this.service.removePassenger(passenger);
  }

  private calculateCompletionState() {
    return this.passengers.length === 0 ? 0 : this.passengers.length > 0 ? 2 : 1;
  }

}
