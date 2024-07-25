import { Component, OnInit, OnDestroy } from '@angular/core';

import { StartService } from './start.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  providers: [
    StartService
  ]
})
export class StartComponent implements OnInit, OnDestroy {

  hasExistingForm = false;
  historyCount = 0;
  isKeyboardOpen = false;

  private keyboardSubscription: Subscription;

  constructor(private service: StartService) { }

  ngOnInit() {
    this.keyboardSubscription = this.service.subscribeToKeyboard().subscribe((isOpen: boolean) => {
      this.isKeyboardOpen = isOpen;
    });
  }

  ngOnDestroy() {
    this.keyboardSubscription.unsubscribe();
  }

  async ionViewWillEnter() {
    this.hasExistingForm = await this.service.initialize();
    this.historyCount = await this.service.getHistoryCount();
  }

  async continueForm() {
    await this.service.continueForm();
  }

  async startNewForm() {
    const didDeleteExisting = await this.service.startNewForm(this.hasExistingForm);
    if (didDeleteExisting) {
      this.hasExistingForm = false;
    }
  }

  async deleteCurrentForm(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    const deleteResult = await this.service.deleteActiveForm();
    if (deleteResult) {
      this.hasExistingForm = false;
    }
  }

  async goToHistory() {
    await this.service.goToHistory();
  }

  toggleEmergencyFooter() {
    this.service.toggleEmergencyFooter();
  }

}
