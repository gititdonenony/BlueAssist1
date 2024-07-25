import { MessageBusService } from "./../../../../services/messagebus.service";
import { ClaimsClickService } from "./../../../../services/claims-click.service";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IonSlides, ViewWillEnter } from "@ionic/angular";
import { PersonalInfoService } from "../shared-services/personal-info.service";
import { IIconRadioOption } from "../../../../services/models.service";
import { LoggerService } from "../../../../services/logger.service";
import { OtherDriverInfo } from "src/app/pages/tabs/Model/claim.model";
import { UserService } from "src/app/services/user.service";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

@Component({
  selector: "app-other-driver-info",
  templateUrl: "./other-driver-info.page.html",
  styleUrls: ["./other-driver-info.page.scss"],
  providers: [PersonalInfoService],
})
export class OtherDriverInfoPage implements OnInit, OnDestroy, ViewWillEnter {
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

  otherDriverInfo: OtherDriverInfo;

  seatbeltOptions: IIconRadioOption[];
  driverInjuredOptions: IIconRadioOption[];
  carryForRewardOptions: IIconRadioOption[];
  liquorDrugUseOptions: IIconRadioOption[];

  selectPopoverOptions = {
    message: "Select the option that is best suited",
  };

  @ViewChild("slider", { static: true }) slider: IonSlides;

  resData: any = {
    FullName: "Ari",
    Surname: "Sarkar",
    CountryOfOrigin: "India",
    Gender: "M",
    IDNumber: "25630024665",
    DateOfIssue: "2022-05-01",
    LicenseNumber: "5000l5564619",
    LicenseCode: "B",
  };

 public otherDriverData: any[] = [];
 public licenseDateOfIssue: string;
  constructor(
    private service: PersonalInfoService,
    private user: UserService,
    private logger: LoggerService,
    private barcodeScanner: BarcodeScanner,
    private claimClickService: ClaimsClickService,
    private messageBusService: MessageBusService
  ) {


    this.service.formInputKeyMapping = {
      FullName: 56,
      Surname: 55,
      Initials: 57,
      CellNumber: 63,
      HomeAddress: 58,
      IDNumber: 52,
      CountryOfOrigin: 54,
      Gender: 65,
      Race: 64,
      LicenseType: 66,
      LicenseNumber: 67,
      DateOfIssue: 68,
      LicenseCode: 69,
      SeatbeltFitted: 71,
      SeatbeltUsed: 72,
      DriverInjured: 70,
      CarryForReward: 91,
      LiquorSuspected: 73,
      LiquorTested: 74,
      Age: 0,
    };
    this.service.pageSettings = {
      FinishDescription:
        "if you have <strong>completed Scan other<br> drivers info </strong> you can<strong>  scan their<br> vehicle info",
      FinishTitle:
        "You are done with scanning<br> <strong>other drivers personal<br> information</strong>",
      BroadcastTargetButton: "OtherDriverInfo",
      BroadcastGoToNext: "OtherVehicleInfo",
      IntroHeader: "Scan Their Smart ID",
    };
    this.otherDriverInfo = new OtherDriverInfo();
    this.GetOtherDriverInfo();
    this.messageBusService.subscribeToDlData().subscribe(res => {
      if (res !== "") {
        this.personalInfoform.patchValue({
          FullName: res.Data.FullName,
          Surname: res.Data.Surname,
          CellNumber:"",
          Initials:""
        });
        this.generalInfoform.patchValue({
          CountryOfOrigin: res.Data.CountryOfOrigin,
          Gender: res.Data.Gender,
          IDNumber: res.Data.IDNumber,
          HomeAddress:"",
          Race:"6"
        });
        this.licenseInfoform.patchValue({
          DateOfIssue: res.data.DateOfIssue,
          LicenseNumber: res.data.LicenseNumber,
          LicenseCode: res.data.LicenseCode,
        });
      }
    });

  }


   ionViewWillEnter() {
    this.otherDriverData = JSON.parse(localStorage.getItem('scannedData_OtherDriverInfo'));
    console.log('this.otherDriverData--------ionViewWillEnter------->>><<<<',this.otherDriverData);
 
    const originalDateString = this.otherDriverData[8];
    const originalDate = new Date(originalDateString);
    const year = originalDate.getFullYear();
    const month = originalDate.getMonth() + 1;
    const day = originalDate.getDate();
    this.licenseDateOfIssue = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    console.log('this.licenseDateOfIssue-----222---********',this.licenseDateOfIssue);
  }


  async ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const showScanner = urlParams.get("scan") === "true";
    this.forms = this.service.initialize(showScanner);
    this.personalInfoform = this.forms.PersonalInfo;
    this.generalInfoform = this.forms.GeneralInfo;
    this.licenseInfoform = this.forms.LicenseInfo;
    this.totalSlides = await this.slider.length();
    //this.radioOptions = await this.service.getRadioOptions(this.otherDriverInfo);
    this.brcode();
    console.log(this.personalInfoform,this.generalInfoform,this.licenseInfoform)

    // setTimeout(() => {
    //   this.personalInfoform.patchValue({
    //     FullName: this.resData.FullName,
    //     Surname: this.resData.Surname,
    //   });
    //   this.generalInfoform.patchValue({
    //     CountryOfOrigin: this.resData.CountryOfOrigin,
    //     Gender: this.resData.Gender,
    //     IDNumber: this.resData.IDNumber,
    //   });
    //   this.licenseInfoform.patchValue({
    //     DateOfIssue: this.resData.DateOfIssue,
    //     LicenseNumber: this.resData.LicenseNumber,
    //     LicenseCode: this.resData.LicenseCode,
    //   });
    //   console.log(this.licenseInfoform.value);
    // }, 5000);

  }

  brcode() {
    this.user.getWithToken(
        "019b094500004a4ed27390d1ff21376edcb5c897ea27df8d37a2ffe1c0fc6b2d53631ca7730634ff1bb52336981eca4ebf1367b5eaf0577f067357128d9ae02763757a5e829cbf3bfdd0572d6e0b1585defdf6eee6347759295e1dfeab22ed32ecc62c903c507f384c4bf907e081bd9ae446602432ffcd7c42ee9498c274105db739a96f836e6b9471a933e7580dd79ffc1f013c92aa0b967f21a4261bb700e2ed7d631c7a7d1b5b1171403e38d1e01674a8073b0e99e50379a260e3521dc5c245cba11020d564e1de4bd22f0d5ca9899af02641ec6361e889fcb805c43c3a11bc9d14229b4382c3d5bfd044aa2f0ef59b4cae5ae6c41adacde6d1fc1060a6226d4c4ddd19196d729141646ba8b116ec99173a66f0b721ba83ae0e62f30438a1795b8914a3252e0233fdb398d7d03e20dcaa093287b877e4241c1cb9f27a2bc6ceae0a50033092966282a3b41a0a465e18791b1bbed823e920537912fa6bdbab75f4484579b5fe9370d1c8c4403c7710e65f1bccd7692922f3eababc9ff03fda72a586ac67f14af6be9b40eed0e1079314093816480c60804a6094b664f79cf37150c7b875a2676734f58cfa560ccc7337edb5c986e48656684ca301b8674c908fe8b61b35e406317d26c57dbf51ecfcef82ddb72bf91bcfe5ad877a56c44390f3c125a8a73887aadc2d4a58bfda069f6c156a70c618ad3cd8b623e55435fd4b90a744de844e15753b851eae20c513f7a64c636756f11648824c0d47f178ca59ca67ee1dbecbb9fc59539ff05021314b23d2027c4a7d76a905b3b05ad3d208544218b36583c92e747ebc03f1c0f1957e68a97cfc07b7baff7d60bd7db36b0d7e404bb11683cbcd331eb794d0d7a3ab5e2966f6a79109f3f1a5c178b74faf2a551dcbb570b068442afafbe9ff620dac66c74f81b84bee0cdfd78ee1b242358adb6b045d0dda06b13fda74cce0eccaa7e2233a14ad39a91420d30455d6ebdb0dd218f802ae8b45c5ef69827c8ef71071b7",
        "d886630dc1cfe499092d7b399a1be760d51f-f7a9-11ec-ae5e-a266"
      )
      .subscribe(res => {
        console.log(res);
      });
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
        this.otherDriverInfo.seatbelt_helmet = option.ID.toString();
        break;
      case "DriverInjured":
        this.otherDriverInfo.driver_injured = option.ID.toString();
        break;
      case "CarryForReward":
        this.otherDriverInfo.carry_passengers = option.ID.toString();
        break;
      case "Liquor":
        this.otherDriverInfo.tested_liquerdrug = option.ID.toString();
        break;
    }
    await this.service.saveRadioOption(optionName, option.ID);
  }

  async backClicked() {
    const currentIndex = await this.slider.getActiveIndex();
    if (currentIndex === 0) {
       localStorage.removeItem('scannedData_OtherDriverInfo');
      //  localStorage.removeItem('scannedData_OtherVehicleInfo');
      //  localStorage.removeItem('scannedData_YourInfo');
      //  localStorage.removeItem('scannedData_YourVehicleInfo');
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
      this.otherDriverInfo.fullname = this.personalInfoform.controls.FullName.value;
      this.otherDriverInfo.surname =
        this.personalInfoform.controls.Surname.value;
      this.otherDriverInfo.initial =
        this.personalInfoform.controls.Initials.value;
      this.otherDriverInfo.cell_number =
        this.personalInfoform.controls.CellNumber.value;

      this.otherDriverInfo.home_address =
        this.generalInfoform.controls.HomeAddress.value;
      this.otherDriverInfo.id_number =
        this.generalInfoform.controls.IDNumber.value;
      this.otherDriverInfo.country_origin =
        this.generalInfoform.controls.CountryOfOrigin.value;
      this.otherDriverInfo.describe_other_driver =
        this.generalInfoform.controls.Race.value;

      this.otherDriverInfo.license_type =
        this.licenseInfoform.controls.LicenseType.value;
      this.otherDriverInfo.license_number =
        this.licenseInfoform.controls.LicenseNumber.value;
      this.otherDriverInfo.license_date_issue =
        this.licenseInfoform.controls.DateOfIssue.value;
      this.otherDriverInfo.license_code =
        this.licenseInfoform.controls.LicenseCode.value;

      await this.service.finish(false);
      this.shouldContinueWithJourney = true;
      // this.shouldContinueWithJourney = await this.service.finish(false);

      this.service.SaveOtherDriverInfo(this.otherDriverInfo);

      localStorage.removeItem('scannedData_OtherDriverInfo');
      // localStorage.removeItem('scannedData_OtherVehicleInfo');
      // localStorage.removeItem('scannedData_YourInfo');
      // localStorage.removeItem('scannedData_YourVehicleInfo');
 
    }
  }

  async sliderChanged(index) {
    this.lazyLoadRadioOptions(index);
  }

  private lazyLoadRadioOptions(index: number) {
    try {
      if (index === 3 && this.seatbeltOptions.length === 0) {
        console.log(this.seatbeltOptions.length);
        this.seatbeltOptions = this.radioOptions.SeatbeltOptions;
      } else if (index === 4 && this.driverInjuredOptions.length === 0) {
        this.driverInjuredOptions = this.radioOptions.DriverInjuredOptions;
      } else if (index === 5 && this.carryForRewardOptions.length === 0) {
        this.carryForRewardOptions = this.radioOptions.CarryForRewardOptions;
      } else if (index === 6 && this.liquorDrugUseOptions.length === 0) {
        this.liquorDrugUseOptions = this.radioOptions.LiquorDrugUseOptions;
      }
    } catch (err) {
      this.logger.error("OtherDriverInfoPage::lazyLoadRadioOptions", err);
    }
  }

  private calculateCompletionState() {
    let isCompleted = true;
    let isNothingComplete = false;

    if (
      !this.personalInfoform.valid &&
      !this.generalInfoform.valid &&
      !this.licenseInfoform.valid
    ) {
      isNothingComplete = true;
    } else if (
      !this.personalInfoform.valid ||
      !this.generalInfoform.valid ||
      !this.licenseInfoform.valid
    ) {
      isCompleted = false;
    }

    if (isCompleted || isNothingComplete) {
      for (const radioOptionKey in this.radioOptions) {
        if (
          this.radioOptions[radioOptionKey].filter(x => x.Selected).length === 0
        ) {
          isCompleted = false;
        } else {
          isNothingComplete = false;
        }
      }
    }
    return isNothingComplete ? 0 : isCompleted ? 2 : 1;
  }

  async GetOtherDriverInfo() {
    var response = await this.service.GetOtherDriverInfo();
    response.subscribe(async (result: any) => {
      console.log('result_________111_____________',result);
      console.log('this.otherDriverData__________222_____________',this.otherDriverData);

      if (result.operation == "success" || this.otherDriverData.length) {
        this.otherDriverInfo = result.data as OtherDriverInfo;


        // this.radioOptions = await this.service.getRadioOptionsForOther( this.otherDriverInfo );

        // this.seatbeltOptions = this.radioOptions.SeatbeltOptions;
        // this.driverInjuredOptions = this.radioOptions.DriverInjuredOptions;
        // this.carryForRewardOptions = this.radioOptions.CarryForRewardOptions;
        // this.liquorDrugUseOptions = this.radioOptions.LiquorDrugUseOptions;



        // this.personalInfoform.controls.FullName.setValue(
        //   this.otherDriverInfo.fullname
        // );
        this.personalInfoform.controls.FullName.setValue(
          this.otherDriverData[1]
        );
        // this.personalInfoform.controls.Surname.setValue(
        //   this.otherDriverInfo.surname
        this.personalInfoform.controls.Surname.setValue(
          this.otherDriverData[0]
        );
        // this.personalInfoform.controls.Initials.setValue(
        //   this.otherDriverInfo.initial
        // );
        // this.personalInfoform.controls.CellNumber.setValue(
        //   this.otherDriverInfo.cell_number
  
        // this.generalInfoform.controls.HomeAddress.setValue(
        //   this.otherDriverInfo.home_address
        // );
        // this.generalInfoform.controls.IDNumber.setValue(
        //   this.otherDriverInfo.id_number
        // );
        this.generalInfoform.controls.IDNumber.setValue(
          this.otherDriverData[4]
        );
        // this.generalInfoform.controls.CountryOfOrigin.setValue(
        //   this.otherDriverInfo.country_origin
        // );
        this.generalInfoform.controls.CountryOfOrigin.setValue(
          this.otherDriverData[3]
        );

        //this.generalInfoform.controls.Gender.setValue(this.otherDriverInfo.);
        // this.generalInfoform.controls.Race.setValue(
        //   this.otherDriverInfo.describe_other_driver
        // );

        this.licenseInfoform.controls.LicenseType.setValue(
          this.otherDriverInfo.license_type
        );
        // this.licenseInfoform.controls.LicenseNumber.setValue(
        //   this.otherDriverInfo.license_number
        // );
        this.licenseInfoform.controls.LicenseNumber.setValue(
          this.otherDriverData[10]
        );
        // this.licenseInfoform.controls.DateOfIssue.setValue(
        //   this.otherDriverInfo.license_date_issue
        // );
        this.licenseInfoform.controls.DateOfIssue.setValue(
          this.licenseDateOfIssue
        );
        // this.licenseInfoform.controls.LicenseCode.setValue(
        //   this.otherDriverInfo.license_code
        // );
      }

     
    });


    this.radioOptions = await this.service.getRadioOptionsForOther( this.otherDriverInfo );

    this.seatbeltOptions = this.radioOptions.SeatbeltOptions;
    this.driverInjuredOptions = this.radioOptions.DriverInjuredOptions;
    this.carryForRewardOptions = this.radioOptions.CarryForRewardOptions;
    this.liquorDrugUseOptions = this.radioOptions.LiquorDrugUseOptions;


  }


   ngOnDestroy(){
       localStorage.removeItem('scannedData_OtherDriverInfo');
      //  localStorage.removeItem('scannedData_OtherVehicleInfo');
      //  localStorage.removeItem('scannedData_YourInfo');
      //  localStorage.removeItem('scannedData_YourVehicleInfo');
  }
}
