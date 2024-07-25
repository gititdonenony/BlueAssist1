import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IonSlides } from "@ionic/angular";

import { PersonalInfoService } from "../shared-services/personal-info.service";
import { IIconRadioOption } from "src/app/services/models.service";
import { CommonCasualty } from "src/app/pages/tabs/Model/claim.model";

@Component({
  selector: "app-passenger-info-capture",
  templateUrl: "./passenger-info-capture.page.html",
  styleUrls: ["./passenger-info-capture.page.scss"],
  providers: [PersonalInfoService],
})
export class PassengerInfoCapturePage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true,
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
  severityOfInjury: number;
  liquorDrugUseOptions: IIconRadioOption[] = [];

  selectPopoverOptions = {
    message: "Select the option that is best suited",
  };

  minimalOptions = false;
  editId = 0;
  showScanner = false;
  type = "";

  @ViewChild("slider", { static: true }) slider: IonSlides;

  _commonCasualty: CommonCasualty;
  _commonId: string = "";
  public passengerData: any[] = [];
  constructor(private service: PersonalInfoService) {
    this._commonCasualty = new CommonCasualty();
    this.buildFormInputKeyMapping();
    this.service.pageSettings = {
      FinishDescription: "",
      FinishTitle: `You just completed adding the ${this.type}`,
      BroadcastTargetButton: "",
      BroadcastGoToNext: "",
      IntroHeader: `Scan ${this.type
        .substr(0, 1)
        .toUpperCase()}${this.type.substr(1)} Smart ID`,
    };
  }

  private buildFormInputKeyMapping() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("minimal") === "true") {
      this.minimalOptions = true;
    }
    this.severityOfInjury = parseInt(urlParams.get("injuryType"), 0);
    this._commonCasualty.cyclist_injured = this.severityOfInjury.toString();
    this._commonCasualty.passenger_injured = this.severityOfInjury.toString();
    this._commonCasualty.pedestrians_injured = this.severityOfInjury.toString();

    this.editId = parseInt(urlParams.get("editId"), 0);
    this.showScanner = urlParams.get("scan") === "true";
    this.type = urlParams.get("type");

    // this.passengerSetData(this.type);

    if (this.minimalOptions) {
      this.service.formInputKeyMapping = {
        IDNumber: 126,
        Surname: 122,
        CellNumber: 127,
        CountryOfOrigin: 0,
        Initials: 0,
        Age: 0,
        HomeAddress: 0,
        Race: 0,
        Gender: 0,
        DriverInjured: 0,
        SeatbeltFitted: 0,
        SeatbeltUsed: 0,
        LiquorSuspected: 0,
        LiquorTested: 0,
        CarryForReward: 0,
        DateOfIssue: 0,
        FullName: 0,
        LicenseCode: 0,
        LicenseNumber: 0,
        LicenseType: 0,
      };
    } else {
      this.service.formInputKeyMapping = {
        IDNumber: 150,
        CountryOfOrigin: 151,
        Surname: 152,
        Initials: 153,
        Age: 154,
        HomeAddress: 155,
        CellNumber: 159,
        Race: 160,
        Gender: 161,
        DriverInjured: 162,
        SeatbeltFitted: 163,
        SeatbeltUsed: 164,
        LiquorSuspected: 165,
        LiquorTested: 166,
        CarryForReward: 0,
        DateOfIssue: 0,
        FullName: 0,
        LicenseCode: 0,
        LicenseNumber: 0,
        LicenseType: 0,
      };
    }
  }

  async ngOnInit() {
    this.forms = this.service.initialize(this.showScanner, true);
    this.personalInfoform = this.forms.PersonalInfo;
    this.generalInfoform = this.forms.GeneralInfo;
    this.licenseInfoform = this.forms.LicenseInfo;
    this.totalSlides = await this.slider.length();
    this.radioOptions = await this.service.getRadioOptionsForCommonCasualty(
      this._commonCasualty
    );

    if (this.severityOfInjury) {
      await this.service.saveRadioOption(
        "DriverInjured",
        this.severityOfInjury
      );
    }
  }
// --------------------------------------------- code for scaner-----------------------------------------------------------------------------

//   ionViewWillEnter() {
//     this.passengerData = JSON.parse(localStorage.getItem('scannedData_passenger'));
//     console.log('this.otherDriverData--------ionViewWillEnter------->>><<<<',this.passengerData);
// }
   
// public passengerSetData(type){


//   if(type === 'passenger'){
//     if(this.passengerData?.length){
  
//       this.personalInfoform.controls.Surname.setValue(this.passengerData[0] );
    
//       this.generalInfoform.controls.IDNumber.setValue(this.passengerData[4]); 
    
//     }
//   }else if(type === 'pedestrian'){
//     if(this.passengerData?.length){
  
//       this.personalInfoform.controls.Surname.setValue(this.passengerData[0] );
    
//       this.generalInfoform.controls.IDNumber.setValue(this.passengerData[4]); 
    
//     }
//   }else if(type === 'cyclist'){
//     if(this.passengerData?.length){
  
//       this.personalInfoform.controls.Surname.setValue(this.passengerData[0] );
    
//       this.generalInfoform.controls.IDNumber.setValue(this.passengerData[4]); 
    
//     }
//   }

// }

// -------------------------------------------------------------------------------------------------------------------
  ionViewWillLeave() {
    const state = this.calculateCompletionState();
    this.buildPassengerObject();
    this.service.broadcastState(state, this.shouldContinueWithJourney);
  }

  setInitials() {
    this.service.setInitials(this.personalInfoform);
  }

  async saveSelection(option: IIconRadioOption, optionName: string) {
    switch (optionName) {
      case "Seatbelt":
        this._commonCasualty.seatbelt_helmet = option.ID.toString();
        break;
      case "Liquor":
        this._commonCasualty.tested_liquerdrug = option.ID.toString();
        break;
    }

    await this.service.saveRadioOption(optionName, option.ID);
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
    if (currentIndex + 1 < this.totalSlides) {
      await this.slider.slideNext();
      this.lazyLoadRadioOptions(currentIndex + 1);
    } else {
      await this.service.finish(false);

      this._commonCasualty.surname =
        this.personalInfoform.controls.Surname.value;
      this._commonCasualty.initial =
        this.personalInfoform.controls.Initials.value;
      this._commonCasualty.age =
        this.personalInfoform.value.Age;
      this._commonCasualty.cell_number =
        this.personalInfoform.controls.CellNumber.value;

      this._commonCasualty.home_address =
        this.generalInfoform.controls.HomeAddress.value;
      this._commonCasualty.id_number =
        this.generalInfoform.controls.IDNumber.value;
      this._commonCasualty.country_origin =
        this.generalInfoform.controls.CountryOfOrigin.value;
      this._commonCasualty.gender = this.generalInfoform.controls.Gender.value;

      this._commonCasualty.describe_cyclist =
        this.generalInfoform.controls.Race.value;
      this._commonCasualty.describe_passenger =
        this.generalInfoform.controls.Race.value;
      this._commonCasualty.describe_pedestrians =
        this.generalInfoform.controls.Race.value;

      console.log(
        this._commonCasualty,
        this.type,
        this._commonCasualty.claim_id
      );
      this.service.SaveCasualityInfo(
        this._commonCasualty,
        this.type,
        this._commonCasualty.claim_id
      );
      this.shouldContinueWithJourney = true;
    }
  }

  async sliderChanged(index) {
    this.lazyLoadRadioOptions(index);
  }

  private lazyLoadRadioOptions(index: number) {
    if (index === 2 && this.seatbeltOptions.length === 0) {
      this.seatbeltOptions = this.radioOptions.SeatbeltOptions;
    } else if (index === 3 && this.driverInjuredOptions.length === 0) {
      this.liquorDrugUseOptions = this.radioOptions.LiquorDrugUseOptions;
    }
  }

  private calculateCompletionState() {
    let isCompleted = true;
    let nothingCompleted = false;
    if (
      !this.personalInfoform.valid &&
      !this.generalInfoform.valid &&
      !this.licenseInfoform.valid
    ) {
      nothingCompleted = true;
    } else if (
      !this.personalInfoform.valid ||
      !this.generalInfoform.valid ||
      !this.licenseInfoform.valid
    ) {
      isCompleted = false;
    }

    if (isCompleted || nothingCompleted) {
      for (const radioOptionKey in this.radioOptions) {
        if (radioOptionKey === "CarryForRewardOptions") {
          continue;
        }
        if (
          this.radioOptions[radioOptionKey].filter(x => x.Selected).length === 0
        ) {
          isCompleted = false;
        } else {
          nothingCompleted = false;
        }
      }
    }
    return nothingCompleted ? 0 : isCompleted ? 2 : 1;
  }

  private buildPassengerObject() {
    let name = this.personalInfoform.get("Surname").value;
    if (!this.minimalOptions && name) {
      name += ` ${this.personalInfoform.get("Initials").value}`;
    }
    this.service.buildAndBroadcastPassengerInfo(
      name,
      this.severityOfInjury,
      this.editId
    );
  }
// --------------------------for scanner---------------------------------------------
//   ngOnDestroy(){
//     localStorage.removeItem('scannedData_passenger');
//     localStorage.removeItem('scannedData_pedestrian');
//     localStorage.removeItem('scannedData_cyclist');
// }
}
