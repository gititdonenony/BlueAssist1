import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

import { SpecialObservationsService } from './special-observations.service';
import { IIconRadioOption } from '../../../../services/models.service';
import { SpecialObservations } from 'src/app/pages/tabs/Model/claim.model';

@Component({
  selector: 'app-special-observations',
  templateUrl: './special-observations.page.html',
  styleUrls: ['./special-observations.page.scss'],
  providers: [
    SpecialObservationsService
  ]
})
export class SpecialObservationsPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };
  radioOptions: {
    TrappedOptions: IIconRadioOption[];
    UseOfCellphone: IIconRadioOption[];
  };

  trappedOptions: IIconRadioOption[] = [];
  useOfCellphoneOptions: IIconRadioOption[] = [];

  totalSlides = 0;

  @ViewChild('slider', { static: true }) slider: IonSlides;
  _specialObservations:SpecialObservations;
  constructor(private service: SpecialObservationsService) {
    this._specialObservations=new SpecialObservations();
   }

  async ngOnInit() {
    this.totalSlides = await this.slider.length();
    this.radioOptions = await this.service.initialize();
    this.trappedOptions = this.radioOptions.TrappedOptions;
    this.useOfCellphoneOptions = this.radioOptions.UseOfCellphone;
  }

  ionViewWillLeave() {
    const completionState = this.calculateCompletionState();
    //console.log(completionState);
    this.service.broadcastState(completionState);
  }

  async saveSelection(option: IIconRadioOption, eventName: string) {
    switch(eventName)
    {
      case "Trapped":
        this._specialObservations.anyone_trappedfallen=option.ID.toString();
        break;
        case "UseOfCellphone":
          this._specialObservations.usinghandheld_devicedriving=option.ID.toString();
          break;
    }
    await this.service.saveRadioSelection(eventName, option.ID);
  }

  async backClicked() {
    const currentIndex = await this.slider.getActiveIndex();
    if (currentIndex === 0) {
      await this.service.finish(true);
    } else {
      await this.slider.slidePrev();
    }
  }

  async nextClicked() {
    const currentIndex = await this.slider.getActiveIndex();
    if (currentIndex < this.totalSlides - 1) {
      await this.slider.slideNext();
    } else {
      await this.service.finish(false);
      this.service.SaveSpecialObservations(this._specialObservations);
    }
  }

  private calculateCompletionState() {
    let allComplete = true;
    let nothingCompleted = true;
    for (const key in this.radioOptions) {
      if (this.radioOptions[key].filter(x => x.Selected).length === 0) {
        allComplete = false;
      } else {
        nothingCompleted = false;
      }
    }

    return nothingCompleted ? 0 : allComplete ? 2 : 1;
  }

}
