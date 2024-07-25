import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

import { DangerousGoodsService } from './dangerous-goods.service';
import { IIconRadioOption } from '../../../../services/models.service';
import { DangerousGoods } from 'src/app/pages/tabs/Model/claim.model';

@Component({
  selector: 'app-dangerous-goods',
  templateUrl: './dangerous-goods.page.html',
  styleUrls: ['./dangerous-goods.page.scss'],
  providers: [
    DangerousGoodsService
  ]
})
export class DangerousGoodsPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };

  radioOptions: {
    GoodsCarriedOptions: IIconRadioOption[];
    SpillageOptions: IIconRadioOption[];
    GasEmissionOptions: IIconRadioOption[];
    PlacardOptions: IIconRadioOption[];
  };

  goodsCarriedOptions: IIconRadioOption[] = [];
  spillageOptions: IIconRadioOption[] = [];
  gasEmissionOptions: IIconRadioOption[] = [];
  placardOptions: IIconRadioOption[] = [];

  totalSlides = 0;

  @ViewChild('slider', { static: true }) slider: IonSlides;

  _dangerousGoods:DangerousGoods;
  constructor(private service: DangerousGoodsService) { 
    this._dangerousGoods=new DangerousGoods();
  }

  async ngOnInit() {
    this.totalSlides = await this.slider.length();
    this.radioOptions = await this.service.initialize();
    this.goodsCarriedOptions = this.radioOptions.GoodsCarriedOptions;
    this.spillageOptions = this.radioOptions.SpillageOptions;
    this.gasEmissionOptions = this.radioOptions.GasEmissionOptions;
    this.placardOptions = this.radioOptions.PlacardOptions;
  }

  ionViewWillLeave() {
    const completionState = this.calculateCompletionState();
    this.service.broadcastState(completionState);
  }

  async saveSelection(option: IIconRadioOption, eventName: string) {
    switch(eventName)
    {
      case "GoodsCarried":
        this._dangerousGoods.good_carried=option.ID.toString();
        break;
      case "Spillage":
        this._dangerousGoods.spillageoccur=option.ID.toString();
          break;
      case "GasEmission":
        this._dangerousGoods.vapour_gasemissionoccur=option.ID.toString();
          break;
      case "Placard":
        this._dangerousGoods.placard_displayonvehicle=option.ID.toString();
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
      this.service.SaveDangerousGoods(this._dangerousGoods);
    }
  }

  private calculateCompletionState() {
    let allComplete = true;
    let nothingComplete = true;
    for (const key in this.radioOptions) {
      if (this.radioOptions[key].filter(x => x.Selected).length === 0) {
        allComplete = false;
      } else {
        nothingComplete = false;
      }
    }

    return nothingComplete ? 0 : allComplete ? 2 : 1;
  }

}
