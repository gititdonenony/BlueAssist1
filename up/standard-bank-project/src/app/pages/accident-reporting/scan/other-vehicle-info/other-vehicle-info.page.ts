import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonSlides, ViewWillEnter } from '@ionic/angular';

import { OtherVehicleInfoService } from './other-vehicle-info.service';

import { IIconRadioOption } from '../../../../services/models.service';
import { OtherDriveVehicleInfo } from 'src/app/pages/tabs/Model/claim.model';

@Component({
  selector: 'app-other-vehicle-info',
  templateUrl: './other-vehicle-info.page.html',
  styleUrls: ['./other-vehicle-info.page.scss'],
  providers: [
    OtherVehicleInfoService
  ]
})
export class OtherVehicleInfoPage implements OnInit, OnDestroy, ViewWillEnter {
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
  othervehicleInfo:OtherDriveVehicleInfo;
  @ViewChild('slider', { static: true }) slider: IonSlides;
  
  public otherVehicaleData: any[] = [];

  constructor(private service: OtherVehicleInfoService) 
  {
    this.othervehicleInfo=new OtherDriveVehicleInfo();
    this.getOtherVehicleInfo();
  }

  async ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const showScanner = urlParams.get('scan') === 'true';
    this.vehicleInfoForm = this.service.initialize(showScanner);

    this.totalSlides = await this.slider.length();
  }

  ionViewWillEnter() {
    this.otherVehicaleData = JSON.parse(localStorage.getItem('scannedData_OtherVehicleInfo'));
     }

  ionViewWillLeave() {
    const state = this.calculateCompletionState();
    this.service.broadcastState(state, this.shouldContinueWithJourney);
  }

  async saveSelection(option: IIconRadioOption, optionName: string) {
    
    switch(optionName)
    {
      case "TyresBurst":
         this.othervehicleInfo.tyres_burst=option.ID.toString();
        break;
      case "Chevron":
         this.othervehicleInfo.quality_chevron=option.ID.toString();
          break;
      
    }

    //await this.service.saveRadioOption(optionName, option.ID);
  }

  async backClicked() {
    const currentIndex = await this.slider.getActiveIndex();
    if (currentIndex === 0) {

      // localStorage.removeItem('scannedData_OtherDriverInfo');
      localStorage.removeItem('scannedData_OtherVehicleInfo');
      // localStorage.removeItem('scannedData_YourInfo');
      // localStorage.removeItem('scannedData_YourVehicleInfo');
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

      this.othervehicleInfo.number_plate=this.vehicleInfoForm?.controls.NumberPlateNumber.value;
      this.othervehicleInfo.licence_disknumber=this.vehicleInfoForm?.controls.LicenceDiskNumber.value;
      this.othervehicleInfo.vehicle_color=this.vehicleInfoForm?.controls.Color.value;
      this.othervehicleInfo.vehicle_make=this.vehicleInfoForm?.controls.Make.value;
      this.othervehicleInfo.vehicle_model=this.vehicleInfoForm?.controls.Model.value;


      await this.service.finish(false);
      this.shouldContinueWithJourney = true;



        console.log('this.othervehicleInfo%%%%%%%%%%%%%%%', this.othervehicleInfo)



      this.service.SaveOtherDriveVehicleInfo(this.othervehicleInfo);

      // localStorage.removeItem('scannedData_OtherDriverInfo');
      localStorage.removeItem('scannedData_OtherVehicleInfo');
      // localStorage.removeItem('scannedData_YourInfo');
      // localStorage.removeItem('scannedData_YourVehicleInfo');
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

  async getOtherVehicleInfo()
  {
    var response= await this.service.GetOtherDriveVehicleInfo();
    response.subscribe(async (result:any)=>{
      console.log(result);


      if(result.operation=='success' || this.otherVehicaleData.length)
      {

        this.othervehicleInfo= result.data as OtherDriveVehicleInfo;


        // this.radioOptions = await this.service.getRadioOptions(this.othervehicleInfo);
        // console.log('this.radioOptions&&&&&&&&&&&&&&&&&&&',this.radioOptions)
        // this.tyresBurstOptions = this.radioOptions.TyresBurstOptions;
        // this.chevronOptions = this.radioOptions.ChevronOptions;
  
      // this.vehicleInfoForm.controls.NumberPlateNumber.setValue(this.othervehicleInfo.number_plate);
      this.vehicleInfoForm.controls.NumberPlateNumber.setValue(this.otherVehicaleData[6]);
      // this.vehicleInfoForm.controls.LicenceDiskNumber.setValue( this.othervehicleInfo.licence_disknumber);
      this.vehicleInfoForm.controls.LicenceDiskNumber.setValue( this.otherVehicaleData[5]);
      // this.vehicleInfoForm.controls.Color.setValue(this.othervehicleInfo.vehicle_color);
      this.vehicleInfoForm.controls.Color.setValue(this.otherVehicaleData[11]);
      // this.vehicleInfoForm.controls.Make.setValue( this.othervehicleInfo.vehicle_make);
      this.vehicleInfoForm.controls.Make.setValue( this.otherVehicaleData[9]);

      // this.vehicleInfoForm.controls.Model.setValue( this.othervehicleInfo.vehicle_model);
      this.vehicleInfoForm.controls.Model.setValue( this.otherVehicaleData[10]);

      }

    });

    this.radioOptions = await this.service.getRadioOptions(this.othervehicleInfo);
      console.log('this.radioOptions&&&&&&&&&&&&&&&&&&&',this.radioOptions)
      this.tyresBurstOptions = this.radioOptions.TyresBurstOptions;
      this.chevronOptions = this.radioOptions.ChevronOptions;

    
  }


  ngOnDestroy(){
    // localStorage.removeItem('scannedData_OtherDriverInfo');
    localStorage.removeItem('scannedData_OtherVehicleInfo');
    // localStorage.removeItem('scannedData_YourInfo');
    // localStorage.removeItem('scannedData_YourVehicleInfo');
}

}
