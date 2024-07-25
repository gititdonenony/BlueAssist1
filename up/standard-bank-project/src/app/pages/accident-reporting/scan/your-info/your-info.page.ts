import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonSlides } from '@ionic/angular';

import { PersonalInfoService } from '../shared-services/personal-info.service';
import { IIconRadioOption } from 'src/app/services/models.service';
// import { YourPersonalInfo } from 'src/app/pages/tabs/Model/claim.model';

@Component({
  selector: 'app-your-info',
  templateUrl: './your-info.page.html',
  styleUrls: ['./your-info.page.scss'],
  providers: [
    PersonalInfoService
  ]
})



export class YourInfoPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };

  totalSlides = 0;

  shouldContinueWithJourney = false;

  forms: {
    PersonalInfo: FormGroup;
    GeneralInfo: FormGroup;
    LicenseInfo: FormGroup;
  };
  radioOptions: {
    SeatbeltOptions: IIconRadioOption[];
    DriverInjuredOptions: IIconRadioOption[];
    CarryForRewardOptions: IIconRadioOption[];
    LiquorDrugUseOptions: IIconRadioOption[];
  };

  personalInfoform: FormGroup;
  generalInfoform: FormGroup;
  licenseInfoform: FormGroup;

  seatbeltOptions: IIconRadioOption[] = [];
  driverInjuredOptions: IIconRadioOption[] = [];
  carryForRewardOptions: IIconRadioOption[] = [];
  liquorDrugUseOptions: IIconRadioOption[] = [];

  selectPopoverOptions = {
    message: 'Select the option that is best suited'
  };

  @ViewChild('slider', { static: true }) slider: IonSlides;
  yourPersonalInfo: YourPersonalInfo;
  public yourInfoData: any[] = [];
  licenseDateOfIssue: string;
  constructor(private service: PersonalInfoService) {
    this.service.formInputKeyMapping = {
      FullName: 31,
      Surname: 30,
      Initials: 32,
      CellNumber: 38,
      HomeAddress: 33,
      IDNumber: 27,
      CountryOfOrigin: 29,
      Gender: 40,
      Race: 39,
      LicenseType: 41,
      LicenseNumber: 42,
      DateOfIssue: 43,
      LicenseCode: 44,
      SeatbeltFitted: 46,
      SeatbeltUsed: 47,
      DriverInjured: 45,
      CarryForReward: 83,
      LiquorSuspected: 48,
      LiquorTested: 49,
      Age: 0
    };
    this.service.pageSettings = {
      FinishDescription: 'if you have<strong> completed scanning<br> you info</strong> you can<strong> scan their vehicle<br> info</strong>',
      FinishTitle: 'You are done with scanning <br><strong>your personal information</strong>',
      BroadcastTargetButton: 'YourInfo',
      BroadcastGoToNext: 'YourVehicleInfo',
      IntroHeader: 'Scan Your Smart ID',
    };

    this.yourPersonalInfo = new YourPersonalInfo();
    this.yourPersonalInfo.fullname = ''
    this.yourPersonalInfo.surname = ''
    this.getYourInfo();
  }

  async ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const showScanner = urlParams.get('scan') === 'true';
    this.forms = this.service.initialize(showScanner);
    this.personalInfoform = this.forms.PersonalInfo;
    this.generalInfoform = this.forms.GeneralInfo;
    this.licenseInfoform = this.forms.LicenseInfo;
    this.totalSlides = await this.slider.length();
    console.log(this.radioOptions)
  }


  ionViewWillEnter() {
    this.yourInfoData = JSON.parse(localStorage.getItem('scannedData_YourInfo'));
    console.log('this.yourInfoData--------------->>><<<<', this.yourInfoData);
    console.log("line no 10**************** in ionviewwill Enter" + this.yourInfoData[10]);

    const originalDateString = this.yourInfoData[8];
    const originalDate = new Date(originalDateString);
    const year = originalDate.getFullYear();
    const month = originalDate.getMonth() + 1;
    const day = originalDate.getDate();
    this.licenseDateOfIssue = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    this.getYourInfo()
    console.log('this.licenseDateOfIssue-----222---********', this.licenseDateOfIssue);
  }

  ionViewWillLeave() {
    const state = this.calculateCompletionState();
    this.service.broadcastState(state, this.shouldContinueWithJourney);
  }

  setInitials() {
    this.service.setInitials(this.personalInfoform);
  }

  async saveSelection(option: IIconRadioOption, optionName: string) {

    switch (optionName) {
      case "Seatbelt":
        this.yourPersonalInfo.seatbelt_helmet = option.ID.toString();
        break;
      case "DriverInjured":
        this.yourPersonalInfo.you_injured = option.ID.toString();
        break;
      case "CarryForReward":
        this.yourPersonalInfo.carry_passengers = option.ID.toString();
        break;
      case "Liquor":
        this.yourPersonalInfo.tested_liquerdrug = option.ID.toString();
        break;
    }

    //await this.service.saveRadioOption(optionName, option.ID);
  }

  async backClicked() {
    const currentIndex = await this.slider.getActiveIndex();
    if (currentIndex === 0) {

      // localStorage.removeItem('scannedData_OtherDriverInfo');
      // localStorage.removeItem('scannedData_OtherVehicleInfo');
      localStorage.removeItem('scannedData_YourInfo');
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
      this.lazyLoadRadioOptions(currentIndex + 1);
    } else {

      this.yourPersonalInfo.surname = this.personalInfoform.controls.Surname.value;
      this.yourPersonalInfo.fullname = this.personalInfoform.controls.FullName.value;
      this.yourPersonalInfo.initial = this.personalInfoform.controls.Initials.value;
      this.yourPersonalInfo.cell_number = this.personalInfoform.controls.CellNumber.value;

      this.yourPersonalInfo.home_address = this.generalInfoform.controls.HomeAddress.value;
      this.yourPersonalInfo.id_number = this.generalInfoform.controls.IDNumber.value;
      this.yourPersonalInfo.country_origin = this.generalInfoform.controls.CountryOfOrigin.value;

      this.yourPersonalInfo.gender = this.generalInfoform.controls.Gender.value;
      this.yourPersonalInfo.describe_other_driver = this.generalInfoform.controls.Race.value;

      this.yourPersonalInfo.license_type = this.licenseInfoform.controls.LicenseType.value;
      this.yourPersonalInfo.license_number = this.licenseInfoform.controls.LicenseNumber.value;
      this.yourPersonalInfo.license_date_issue = this.licenseInfoform.controls.DateOfIssue.value;
      this.yourPersonalInfo.license_code = this.licenseInfoform.controls.LicenseCode.value;

      this.shouldContinueWithJourney = await this.service.finish(false);
      console.log("all details ________________"+this.yourInfoData);
      
      this.service.SaveYourInfo(this.yourPersonalInfo);


      // localStorage.removeItem('scannedData_OtherDriverInfo');
      // localStorage.removeItem('scannedData_OtherVehicleInfo');
      localStorage.removeItem('scannedData_YourInfo');
      // localStorage.removeItem('scannedData_YourVehicleInfo');
    }
  }

  async sliderChanged(index) {
    this.lazyLoadRadioOptions(index);
  }

  private lazyLoadRadioOptions(index: number) {
    if (index === 3 && this.seatbeltOptions.length === 0) {
      this.seatbeltOptions = this.radioOptions.SeatbeltOptions;
    } else if (index === 4 && this.driverInjuredOptions.length === 0) {
      this.driverInjuredOptions = this.radioOptions.DriverInjuredOptions;
    } else if (index === 5 && this.carryForRewardOptions.length === 0) {
      this.carryForRewardOptions = this.radioOptions.CarryForRewardOptions;
    } else if (index === 6 && this.liquorDrugUseOptions.length === 0) {
      this.liquorDrugUseOptions = this.radioOptions.LiquorDrugUseOptions;
    }
  }

  private calculateCompletionState() {
    let isCompleted = true;
    let isNothingComplete = false;

    if (!this.personalInfoform.valid && !this.generalInfoform.valid && !this.licenseInfoform.valid) {
      isNothingComplete = true;
    } else if (!this.personalInfoform.valid || !this.generalInfoform.valid || !this.licenseInfoform.valid) {
      isCompleted = false;
    }

    if (isCompleted || isNothingComplete) {
      for (const radioOptionKey in this.radioOptions) {
        if (this.radioOptions[radioOptionKey].filter(x => x.Selected).length === 0) {
          isCompleted = false;
        } else {
          isNothingComplete = false;
        }
      }
    }
    return isNothingComplete ? 0 : isCompleted ? 2 : 1;
  }

  async getYourInfo() {
    // this.licenseInfoform.controls.LicenseNumber.setValue(this.yourInfoData[10]);
    var response = await this.service.GetYourPersonalInfo();
    response.subscribe(async (result: any) => {
      console.log(result);
      if (result.operation == 'success' || this.yourInfoData.length) {
        // alert("enter in if block")
        this.yourPersonalInfo = result.data as YourPersonalInfo;
        this.licenseInfoform.controls.LicenseNumber.setValue(this.yourInfoData[10]);

        // this.personalInfoform.controls.FullName.setValue(this.yourPersonalInfo.fullname);
        this.personalInfoform.controls.FullName.setValue(this.yourInfoData[1]);
        // this.personalInfoform.controls.Surname.setValue( this.yourPersonalInfo.surname);
        this.personalInfoform.controls.Surname.setValue(this.yourInfoData[0]);
        // this.personalInfoform.controls.Initials.setValue(this.yourPersonalInfo.initial);
        // this.personalInfoform.controls.CellNumber.setValue( this.yourPersonalInfo.cell_number);

        // this.generalInfoform.controls.HomeAddress.setValue( this.yourPersonalInfo.home_address);
        // this.generalInfoform.controls.IDNumber.setValue(this.yourPersonalInfo.id_number);
        this.generalInfoform.controls.IDNumber.setValue(this.yourInfoData[4]);
        // this.generalInfoform.controls.CountryOfOrigin.setValue(this.yourPersonalInfo.country_origin);
        this.generalInfoform.controls.CountryOfOrigin.setValue(this.yourInfoData[3]);

        // this.generalInfoform.controls.Gender.setValue(this.yourPersonalInfo.gender);
        // this.generalInfoform.controls.Race.setValue(this.yourPersonalInfo.describe_other_driver);

        this.licenseInfoform.controls.LicenseType.setValue(this.yourPersonalInfo.license_type);;
        // this.licenseInfoform.controls.LicenseNumber.setValue(this.yourPersonalInfo.license_number);

        this.licenseInfoform.controls.LicenseNumber.setValue(this.yourInfoData[10]);
        // this.licenseInfoform.controls.DateOfIssue.setValue(this.yourPersonalInfo.license_date_issue);
        this.licenseInfoform.controls.DateOfIssue.setValue(this.licenseDateOfIssue);
        // this.licenseInfoform.controls.LicenseCode.setValue(this.yourPersonalInfo.license_code);

      }


    });


    this.radioOptions = await this.service.getRadioOptions(this.yourPersonalInfo);


    this.seatbeltOptions = this.radioOptions.SeatbeltOptions;
    this.driverInjuredOptions = this.radioOptions.DriverInjuredOptions;
    this.carryForRewardOptions = this.radioOptions.CarryForRewardOptions;
    this.liquorDrugUseOptions = this.radioOptions.LiquorDrugUseOptions;
  }


  ngOnDestroy() {
    // localStorage.removeItem('scannedData_OtherDriverInfo');
    // localStorage.removeItem('scannedData_OtherVehicleInfo');
    localStorage.removeItem('scannedData_YourInfo');
    // localStorage.removeItem('scannedData_YourVehicleInfo');
  }

}

class YourPersonalInfo {
  claim_id: number
  fullname: string = ''
  surname: string
  initial: string
  cell_number: string
  home_address: string;
  id_number: string;
  country_origin: string;
  describe_other_driver: string;
  license_type: string;
  license_number: string;
  license_date_issue: string;
  license_code: string;
  seatbelt_helmet: string;
  you_injured: string;
  carry_passengers: string;
  tested_liquerdrug: string;
  gender: string;
}