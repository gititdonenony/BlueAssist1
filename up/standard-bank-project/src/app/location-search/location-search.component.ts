import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

import { LocationService, AutoCompleteSuggestion } from './location-search.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss'],
  providers: [
    LocationService
  ]
})
export class LocationSearchComponent implements OnInit, OnDestroy {
  isGeoCodingResult = false;

  locationAddress = '';
  autoCompleteResults: AutoCompleteSuggestion[] = [];

  @Output() openOverlay = new EventEmitter();
  @Output() closeOverlay = new EventEmitter();

  private locationPromptSubscription: Subscription;

  constructor(private service: LocationService) {}

  async ngOnInit() {
    this.locationAddress = await this.service.initialize();
    this.locationPromptSubscription = this.service.subscribeToLocationPrompt().subscribe(async () => {
      await this.getCurrentLocation();
    });
  }

  ngOnDestroy() {
    this.locationPromptSubscription.unsubscribe();
  }

  async getCurrentLocation() {
    this.isGeoCodingResult = true;
    const addressResult = await this.service.getCurrentLocation();
    this.isGeoCodingResult = false;
    this.closeOverlay.emit();
    this.locationAddress = addressResult ? addressResult : this.locationAddress;
  }

  autoCompleteFocusChange() {
    this.openOverlay.emit();
  }

  async autoCompleteLocation() {
    this.autoCompleteResults = await this.service.autoCompleteLocation(this.locationAddress);
  }

  async selectAutoComplete(autoCompleteResult: AutoCompleteSuggestion) {
    this.isGeoCodingResult = true;
    this.autoCompleteResults = [];
    const addressResult = await this.service.selectAutoComplete(autoCompleteResult);
    this.isGeoCodingResult = false;
    this.locationAddress = addressResult ? addressResult : this.locationAddress;
    this.closeOverlay.emit();
  }

  async shareLocation() {
    await this.service.shareLocation();
    this.closeOverlay.emit();
  }
}
