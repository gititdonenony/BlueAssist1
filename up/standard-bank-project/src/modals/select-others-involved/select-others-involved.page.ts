import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { IPassenger, SeverityOfInjury } from "src/app/services/models.service";

@Component({
  selector: 'app-select-others-involved',
  templateUrl: './select-others-involved.page.html',
  styleUrls: ['./select-others-involved.page.scss'],
})
export class SelectOthersInvolvedPage implements OnInit {

  injuredPeople: OtherPerson[] = [];
  notInjuredPeople: OtherPerson[] = [];

  footerVisible = false;

  injuredEnabled = true;
  notInjuredEnabled = true;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    const iconBasePath = 'assets/icons/tap/severity_of_injury/';
    const getIcon = (injuryType: SeverityOfInjury) => {
      switch (injuryType) {
        case SeverityOfInjury.NoInjury:
          return 'no_injury.svg';
        case SeverityOfInjury.Slight:
          return 'slight.svg';
        case SeverityOfInjury.Serious:
          return 'serious.svg';
        case SeverityOfInjury.Killed:
          return 'killed.svg';
      }
    };
    this.injuredPeople.forEach(x => {
      x.Icon = `${iconBasePath}${getIcon(x.Data.InjuryType)}`;
    });
    this.notInjuredPeople.forEach(x => {
      x.Icon = `${iconBasePath}${getIcon(x.Data.InjuryType)}`;
    });
  }

  injuredChanged() {
    if (this.injuredPeople.filter(x => x.Selected).length === 4) {
      this.injuredEnabled = false;
    } else {
      this.injuredEnabled = true;
    }
    this.setFooterVisibility();
  }

  notInjuredChanged() {
    if (this.notInjuredPeople.filter(x => x.Selected).length === 3) {
      this.notInjuredEnabled = false;
    } else {
      this.notInjuredEnabled = true;
    }
    this.setFooterVisibility();
  }

  async selectPassengers() {
    const selected = {
      Injured: [],
      NotInjured: []
    };

    this.injuredPeople.forEach(x => {
      if (x.Selected) {
        selected.Injured.push(x);
      }
    });
    this.notInjuredPeople.forEach(x => {
      if (x.Selected) {
        selected.NotInjured.push(x);
      }
    });

    await this.modalController.dismiss(selected, 'success');
  }

  private setFooterVisibility() {
    let isVisible = true;
    if (this.injuredPeople.length > 0 && this.injuredEnabled) {
      isVisible = false;
    }
    if (isVisible && this.notInjuredPeople.length > 0 && this.notInjuredEnabled) {
      isVisible = false;
    }
    this.footerVisible = isVisible;
  }

}

interface OtherPerson {
  Type: string;
  Data: IPassenger;
  Icon: string;
  Selected?: boolean;
}
