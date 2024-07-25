import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonSlides } from '@ionic/angular';

import { YourVehicleInfoService } from './your-vehicle-info.service';

import { IIconRadioOption } from '../../../../services/models.service';
import { YourVehicleInfo } from 'src/app/pages/tabs/Model/claim.model';

@Component({
  selector: 'app-your-vehicle-info',
  templateUrl: './your-vehicle-info.page.html',
  styleUrls: ['./your-vehicle-info.page.scss'],
  providers: [
    YourVehicleInfoService
  ]
})
export class YourVehicleInfoPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };
  totalSlides = 0;
  shouldContinueWithJourney = false;

  radioOptions: {
    TyresBurstOptions: IIconRadioOption[];
    ChevronOptions: IIconRadioOption[];
  };

  vehicleInfoForm: FormGroup;

  tyresBurstOptions: IIconRadioOption[];
  chevronOptions: IIconRadioOption[];

  @ViewChild('slider', { static: true }) slider: IonSlides;
  yourVehicleInfo:YourVehicleInfo;
  public yourVehicaleData: any[]=[];
  constructor(private service: YourVehicleInfoService) 
  {
    this.yourVehicleInfo=new YourVehicleInfo()
    this.getVehicleInfo();
   }

  async ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const showScanner = urlParams.get('scan') === 'true';
    this.vehicleInfoForm = this.service.initialize(showScanner);

    this.totalSlides = await this.slider.length();

  }


  ionViewWillEnter() {
    this.yourVehicaleData = JSON.parse(localStorage.getItem('scannedData_YourVehicleInfo'));
     }

  ionViewWillLeave() {
    const state = this.calculateCompletionState();
    this.service.broadcastState(state, this.shouldContinueWithJourney);
  }

  async saveSelection(option: IIconRadioOption, optionName: string) {

    switch(optionName)
    {
         case "TyresBurst":
           this.yourVehicleInfo.tyres_burst=option.ID.toString();
           break;
           case "Chevron":
           this.yourVehicleInfo.quality_chevron=option.ID.toString();
           break;          
    }
    //await this.service.saveRadioOption(optionName, option.ID);
  }

  async backClicked() {
    const currentIndex = await this.slider.getActiveIndex();
    if (currentIndex === 0) {
    //   localStorage.removeItem('scannedData_OtherDriverInfo');
    // localStorage.removeItem('scannedData_OtherVehicleInfo');
    // localStorage.removeItem('scannedData_YourInfo');
    localStorage.removeItem('scannedData_YourVehicleInfo');
      await this.service.finish(true);
    } else {
      await this.slider.slidePrev();
    }
  }

  async nextClicked() {
    const currentIndex = await this.slider.getActiveIndex();
    if (currentIndex + 1 < this.totalSlides) {
      await this.slider.slideNext();
    } else {
      await this.service.finish(false);
      this.shouldContinueWithJourney = true;
      
      this.yourVehicleInfo.number_plate=this.vehicleInfoForm.controls.NumberPlateNumber.value;
      this.yourVehicleInfo.licence_disknumber=this.vehicleInfoForm.controls.LicenceDiskNumber.value;
      this.yourVehicleInfo.vehicle_color=this.vehicleInfoForm.controls.Color.value;
      this.yourVehicleInfo.vehicle_make=this.vehicleInfoForm.controls.Make.value;
      this.yourVehicleInfo.vehicle_model=this.vehicleInfoForm.controls.Model.value;

      this.service.SaveVechicleInfo(this.yourVehicleInfo)

    //   localStorage.removeItem('scannedData_OtherDriverInfo');
    // localStorage.removeItem('scannedData_OtherVehicleInfo');
    // localStorage.removeItem('scannedData_YourInfo');
    localStorage.removeItem('scannedData_YourVehicleInfo');
    }
  }

  private calculateCompletionState() {
    let isNothingCompleted = !this.vehicleInfoForm.valid;
    let isCompleted = this.vehicleInfoForm.valid;
    if (isCompleted || isNothingCompleted) {
      for (const radioOptionKey in this.radioOptions) {
        if (this.radioOptions[radioOptionKey].filter(x => x.Selected).length === 0) {
          isCompleted = false;
        } else {
          isNothingCompleted = false;
        }
      }
    }
    return isNothingCompleted ? 0 : isCompleted ? 2 : 1;
  }

  async getVehicleInfo()
  {
    

    var response= await this.service.GetYourVihicleInfo();
    response.subscribe(async (result:any)=>{
      console.log(result);
      if(result.operation=='success' || this.yourVehicaleData.length)
      {

        this.yourVehicleInfo=result.data as YourVehicleInfo;
        
      // this.vehicleInfoForm.controls.NumberPlateNumber.setValue(this.yourVehicleInfo.number_plate);
      this.vehicleInfoForm.controls.NumberPlateNumber.setValue(this.yourVehicaleData[6]);
      // this.vehicleInfoForm.controls.LicenceDiskNumber.setValue( this.yourVehicleInfo.licence_disknumber);
      this.vehicleInfoForm.controls.LicenceDiskNumber.setValue( this.yourVehicaleData[5]);
      // this.vehicleInfoForm.controls.Color.setValue(this.yourVehicleInfo.vehicle_color);
      this.vehicleInfoForm.controls.Color.setValue(this.yourVehicaleData[11]);
      // this.vehicleInfoForm.controls.Make.setValue( this.yourVehicleInfo.vehicle_make);
      this.vehicleInfoForm.controls.Make.setValue( this.yourVehicaleData[9]);

      // this.vehicleInfoForm.controls.Model.setValue( this.yourVehicleInfo.vehicle_model);
      this.vehicleInfoForm.controls.Model.setValue( this.yourVehicaleData[10]);

      }

    //   this.radioOptions = await this.service.getRadioOptions(this.yourVehicleInfo);
      
    // this.tyresBurstOptions = this.radioOptions.TyresBurstOptions;
    // this.chevronOptions = this.radioOptions.ChevronOptions;
  });

    this.radioOptions = await this.service.getRadioOptions(this.yourVehicleInfo);
    
  this.tyresBurstOptions = this.radioOptions.TyresBurstOptions;
  this.chevronOptions = this.radioOptions.ChevronOptions;
  }


  ngOnDestroy(){
    // localStorage.removeItem('scannedData_OtherDriverInfo');
    // localStorage.removeItem('scannedData_OtherVehicleInfo');
    // localStorage.removeItem('scannedData_YourInfo');
    localStorage.removeItem('scannedData_YourVehicleInfo');
}

}
