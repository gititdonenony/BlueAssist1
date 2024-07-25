import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NavController } from "@ionic/angular";

import { Subscription } from "rxjs";

import {
  ValidateCellNumber,
  ValidateDateNotInFuture,
} from "../../../../services/formvalidators.service";
import { StorageService } from "../../../../services/storage.service";
import { GlobalService } from "../../../../services/global.service";
import { ScannerService } from "../../../../services/scanner.service";
import { PageBuilderService } from "../../../../services/pagebuilder.service";
import { MessageBusService } from "../../../../services/messagebus.service";
import { IPassenger } from "../../../../services/models.service";
import { IIconRadioOption } from "../../../../services/models.service";
import { LoggerService } from "../../../../services/logger.service";
import { CameraService } from "../../../../camera.service";
import { GenericPopupPage } from "src/app/generic-popup/generic-popup.page";
import {
  CommonCasualty,
  OtherDriverInfo,
  YourPersonalInfo,
} from "src/app/pages/tabs/Model/claim.model";
import { ClaimService } from "src/app/services/claim.service";

@Injectable()
export class PersonalInfoService {
  formInputKeyMapping = {
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
    Age: 0,
  };
  pageSettings = {
    FinishDescription:
      "if you have  <strong>completed Scan other<br> Drivers info</strong> you can scan their vehicle info",
    FinishTitle:
      "You are done with scanning <br><strong>your personal information </strong>",
    BroadcastTargetButton: "your-info",
    BroadcastGoToNext: "/accident-reporting/scan/your-vehicle-info",
    IntroHeader: "Scan Your Smart ID",
  };
  private personalInfoSubscription: Subscription;
  private generalInfoSubscription: Subscription;
  private licenseInfoSubscription: Subscription;
  userprofile: any;

  constructor(
    private storage: StorageService,
    private global: GlobalService,
    private scanner: ScannerService,
    private pageBuilder: PageBuilderService,
    private camera: CameraService,
    private nav: NavController,
    private messageBus: MessageBusService,
    private logger: LoggerService,
    private claimService: ClaimService
  ) {}

  initialize(showScanner: boolean, includeAge: boolean = false) {
    const forms = {
      PersonalInfo: this.buildPersonalInfoForm(includeAge),
      GeneralInfo: this.buildGeneralInfoForm(),
      LicenseInfo: this.buildLicenseInfoForm(),
    };
    if (showScanner) {
      // this.scanSmartId(forms);
    }
    return forms;
  }

  async finish(popOnly: boolean): Promise<boolean> {
    if (popOnly) {
      await this.nav.pop();
      return false;
    }

    const doneModal = await this.global.modal(
      GenericPopupPage,
      {
        header: "you are Done!",
        description: [this.pageSettings.FinishDescription],
        title: this.pageSettings.FinishTitle,
        image: "assets/lottie/section-done_84c64ab1.gif",
      },
      "small-popup"
    );
    const result = await doneModal.onDidDismiss();
    if (result.data) {
      await this.nav.pop();
      return true;
    }
    return false;
  }

  async SaveOtherDriverInfo(otherDriverInfo: OtherDriverInfo) {
    var token = await this.storage.get("WbAuth");
    var claim_id = await this.storage.get("ClaimAuth");

    if (token != "" && claim_id != "") {
      otherDriverInfo.claim_id = claim_id;
      let response = this.claimService.AddOtherDriverInfo(
        token,
        otherDriverInfo
      );
      response.subscribe(result => {
        console.log(result);
      });
    }
  }

  async SaveCasualityInfo(commonCasualty: CommonCasualty, type, Id) {
    var token = await this.storage.get("WbAuth");
    var claim_id = await this.storage.get("ClaimAuth");

    if (token != "" && claim_id != "") {
      commonCasualty.claim_id = claim_id;
      let response = this.claimService.AddCasualityInfo(
        token,
        commonCasualty,
        type,
        Id
      );
      response.subscribe(result => {
        console.log(result);
      });
    }
  }

  async SaveYourInfo(yourPersonalInfo: YourPersonalInfo) {
    var token = await this.storage.get("WbAuth");
    var claim_id = await this.storage.get("ClaimAuth");

    if (token != "" && claim_id != "") {
      yourPersonalInfo.claim_id = claim_id;
      let response = this.claimService.AddYourPersonalInfo(
        token,
        yourPersonalInfo
      );
      response.subscribe(result => {
        console.log(result);
      });
    }
  }

  async GetYourPersonalInfo() {
    var token = await this.storage.get("WbAuth");
    var claim_id = await this.storage.get("ClaimAuth");

    if (token != "" && claim_id != "") {
      let response = this.claimService.getYourPersonalInfo(token, claim_id);
      return response;
    }
  }

  async GetOtherDriverInfo() {
    var token = await this.storage.get("WbAuth");
    var claim_id = await this.storage.get("ClaimAuth");

    if (token != "" && claim_id != "") {

          console.log('token$$$$$$', token);
          console.log('claim_id$$$$$$', claim_id);

      let response = this.claimService.getOtherDriverInfo(token, claim_id);
      return response;
    }
  }

  async GetOtherDriveVehicleInfo() {
    var token = await this.storage.get("WbAuth");
    var claim_id = await this.storage.get("ClaimAuth");

    if (token != "" && claim_id != "") {
      let response = this.claimService.getOtherDriveVehicleInfo(
        token,
        claim_id
      );
      return response;
    }
  }

  buildAndBroadcastPassengerInfo(
    builtUpName: string,
    severityOfInjury: number,
    editId: number
  ) {
    const passengerInfo: IPassenger = {
      InjuryType: severityOfInjury,
      Name: builtUpName,
      ID: editId,
    };
    this.messageBus.sendPassengerPageMessage(passengerInfo);
  }

  broadcastState(completionState: number, shouldContinue: boolean) {
    this.personalInfoSubscription.unsubscribe();
    this.generalInfoSubscription.unsubscribe();
    this.licenseInfoSubscription.unsubscribe();
    this.messageBus.sendMessageToHomePageMessageBus({
      State: completionState,
      TargetButton: this.pageSettings.BroadcastTargetButton,
      GoToNext: shouldContinue ? this.pageSettings.BroadcastGoToNext : "",
    });
  }

  async getRadioOptions(yourPersonalInfo: YourPersonalInfo) {
    console.log(yourPersonalInfo);
    const radioOptions = {
      SeatbeltOptions: await this.getSeatbeltOptions(
        Number(yourPersonalInfo.seatbelt_helmet)
      ),
      DriverInjuredOptions: await this.getGenericOptions(
        this.pageBuilder.severityOfInjuryOptions(),
        Number(yourPersonalInfo.you_injured)
      ),
      CarryForRewardOptions: await this.getGenericOptions(
        this.pageBuilder.yesNoUnknownOptions(),
        Number(yourPersonalInfo.carry_passengers)
      ),
      LiquorDrugUseOptions: await this.getLiquorOptions(
        Number(yourPersonalInfo.tested_liquerdrug)
      ),
    };
    return radioOptions;
  }

  async getRadioOptionsForOther(otherInfo: OtherDriverInfo) {
    console.log(otherInfo);
    const radioOptions = {
      SeatbeltOptions: await this.getSeatbeltOptions(
        Number(otherInfo.seatbelt_helmet)
      ),
      DriverInjuredOptions: await this.getGenericOptions(
        this.pageBuilder.severityOfInjuryOptions(),
        Number(otherInfo.driver_injured)
      ),
      CarryForRewardOptions: await this.getGenericOptions(
        this.pageBuilder.yesNoUnknownOptions(),
        Number(otherInfo.carry_passengers)
      ),
      LiquorDrugUseOptions: await this.getLiquorOptions(
        Number(otherInfo.tested_liquerdrug)
      ),
    };
    return radioOptions;
  }
  commonCasualty: CommonCasualty;

  async getRadioOptionsForCommonCasualty(commonCasualty: CommonCasualty) {
    //console.log(yourPersonalInfo);
    const radioOptions = {
      SeatbeltOptions: await this.getSeatbeltOptions(
        Number(commonCasualty.seatbelt_helmet)
      ),
      DriverInjuredOptions: await this.getGenericOptions(
        this.pageBuilder.severityOfInjuryOptions(),
        Number(commonCasualty)
      ),
      CarryForRewardOptions: await this.getGenericOptions(
        this.pageBuilder.yesNoUnknownOptions(),
        Number(commonCasualty)
      ),
      LiquorDrugUseOptions: await this.getLiquorOptions(
        Number(commonCasualty.tested_liquerdrug)
      ),
    };
    return radioOptions;
  }
  buildPersonalInfoForm(includeAge: boolean = false): FormGroup {
    const formGroup = new FormGroup({
      FullName: new FormControl("", {
        updateOn: "blur",
        validators: Validators.required,
      }),
      Surname: new FormControl("", {
        updateOn: "blur",
        validators: Validators.required,
      }),
      Initials: new FormControl("", {
        updateOn: "blur",
        validators: Validators.required,
      }),
      CellNumber: new FormControl("", {
        updateOn: "blur",
        validators: [Validators.required, ValidateCellNumber],
      }),
      Age: new FormControl("", {

        // updateOn: "blur",
        // validators: [Validators.required],
      }),
    });
    if (includeAge) {
      formGroup.addControl(
        "Age",
        new FormControl("", {
          updateOn: "blur",
          validators: Validators.required,
        })
      );
    }
    this.personalInfoSubscription = formGroup.valueChanges.subscribe(x => {
      this.saveInfo(x);
    });
    (async (group: FormGroup) => {
      await this.populateInfo(group);
    })(formGroup);
    return formGroup;
  }
   
  buildGeneralInfoForm(): FormGroup {
    const formGroup = new FormGroup({
      HomeAddress: new FormControl("", {
        updateOn: "blur",
        validators: Validators.required,
      }),
      IDNumber: new FormControl("", {
        updateOn: "blur",
        validators: Validators.required,
      }),
      CountryOfOrigin: new FormControl("", {
        updateOn: "blur",
        validators: Validators.required,
      }),
      Gender: new FormControl(null, { updateOn: "blur" }),
      Race: new FormControl(null, {
        updateOn: "blur",
        validators: Validators.required,
      }),
    });
    this.generalInfoSubscription = formGroup.valueChanges.subscribe(x => {
      this.saveInfo(x);
    });
    (async (group: FormGroup) => {
      await this.populateInfo(group);
    })(formGroup);
    return formGroup;
  }

  buildLicenseInfoForm(): FormGroup {
    const formGroup = new FormGroup({
      LicenseType: new FormControl("", {
        updateOn: "blur",
        validators: Validators.required,
      }),
      LicenseNumber: new FormControl("", {
        updateOn: "blur",
        validators: Validators.required,
      }),
      DateOfIssue: new FormControl("", {
        updateOn: "blur",
        validators: [Validators.required, ValidateDateNotInFuture],
      }),
      LicenseCode: new FormControl("", {
        updateOn: "blur",
        validators: Validators.required,
      }),
    });
    this.licenseInfoSubscription = formGroup.valueChanges.subscribe(x => {
      this.saveInfo(x);
    });
    (async (group: FormGroup) => {
      await this.populateInfo(group);
    })(formGroup);
    return formGroup;
  }

  setInitials(personalInfoform: FormGroup) {
    const fullNameControl = personalInfoform.get("FullName");
    if (fullNameControl.value) {
      let initials = "";
      const fullNameParts: string[] = fullNameControl.value.split(" ");
      for (const part of fullNameParts) {
        initials += part.substr(0, 1).toUpperCase();
      }
      if (initials) {
        personalInfoform.get("Initials").setValue(initials);
      }
    }
  }

  async saveRadioOption(optionName: string, value: number) {
    try {
      if (this.formInputKeyMapping[optionName]) {
        await this.storage.setARFormInput(
          this.formInputKeyMapping[optionName],
          value
        );
      } else if (optionName === "Seatbelt") {
        await this.saveSeatbeltOptions(value);
      } else if (optionName === "DriverInjured") {
        await this.saveDriverInjuredOptions(value);
      } else if (optionName === "Liquor") {
        await this.saveLiquorOptions(value);
      }
    } catch (err) {
      this.logger.error("PersonalInfoService::saveRadioOption", err);
    }
  }

  private async saveSeatbeltOptions(selectedId: number) {
    try {
      let seatbeltUsed = null;
      let seatbeltFitted = null;
      switch (selectedId) {
        case 1:
          seatbeltFitted = 1;
          seatbeltUsed = 1;
          break;
        case 2:
          seatbeltFitted = 1;
          seatbeltUsed = 2;
          break;
        case 3:
          seatbeltUsed = 2;
          seatbeltFitted = 2;
          break;
        case 4:
          seatbeltUsed = 3;
          seatbeltFitted = 3;
      }
      const fieldsToSave = {};
      fieldsToSave[this.formInputKeyMapping.SeatbeltFitted] = seatbeltFitted;
      fieldsToSave[this.formInputKeyMapping.SeatbeltUsed] = seatbeltUsed;
      await this.storage.insertBulkARFormInputs(fieldsToSave);
    } catch (err) {
      this.logger.error("PersonalInfoService::saveSeatbeltOptions", err);
    }
  }

  private async saveDriverInjuredOptions(selectedId: number) {
    try {
      let driverInjured = null;
      let InjureSuspected = null;
      switch (selectedId) {
        case 1:
          InjureSuspected = 1;
          driverInjured = 1;
          break;
        case 2:
          InjureSuspected = 1;
          driverInjured = 2;
          break;
        case 3:
          driverInjured = 2;
          InjureSuspected = 2;
          break;
      }
      const fieldsToSave = {};
      fieldsToSave[this.formInputKeyMapping.DriverInjured] = driverInjured;

      await this.storage.insertBulkARFormInputs(fieldsToSave);
    } catch (err) {
      this.logger.error("PersonalInfoService::saveLiquorOptions", err);
    }
  }

  private async saveLiquorOptions(selectedId: number) {
    try {
      let liqourUsed = null;
      let liqourSuspected = null;
      switch (selectedId) {
        case 1:
          liqourSuspected = 1;
          liqourUsed = 1;
          break;
        case 2:
          liqourSuspected = 1;
          liqourUsed = 2;
          break;
        case 3:
          liqourUsed = 2;
          liqourSuspected = 2;
          break;
      }
      const fieldsToSave = {};
      fieldsToSave[this.formInputKeyMapping.LiquorTested] = liqourUsed;
      fieldsToSave[this.formInputKeyMapping.LiquorSuspected] = liqourSuspected;
      await this.storage.insertBulkARFormInputs(fieldsToSave);
    } catch (err) {
      this.logger.error("PersonalInfoService::saveLiquorOptions", err);
    }
  }

  private async getSeatbeltOptions(savedOption) {
    try {
      const seatbeltSavedOptions = await this.storage.getBulkARFormInputs([
        this.formInputKeyMapping.SeatbeltFitted,
        this.formInputKeyMapping.SeatbeltUsed,
      ]);
      //const seatbeltFittedSavedOption = seatbeltSavedOptions[this.formInputKeyMapping.SeatbeltFitted];
      //const seatbeltUsedSavedOption = seatbeltSavedOptions[this.formInputKeyMapping.SeatbeltUsed];
      const options = this.pageBuilder.seatbeltUsedOptions();
      // if (seatbeltFittedSavedOption && seatbeltUsedSavedOption) {
      //     let seatbeltOption = 0;
      //     if (seatbeltUsedSavedOption === 1 && seatbeltFittedSavedOption === 1) {
      //         seatbeltOption = 1;
      //     } else if (seatbeltUsedSavedOption === 2 && seatbeltFittedSavedOption === 1) {
      //         seatbeltOption = 2;
      //     } else if (seatbeltUsedSavedOption === 2 && seatbeltFittedSavedOption === 2) {
      //         seatbeltOption = 3;
      //     } else if (seatbeltUsedSavedOption === 3 && seatbeltFittedSavedOption === 3) {
      //         seatbeltOption = 4;
      //     }
      //     if (seatbeltOption) {
      //         const optionToSet = options.find(x => x.ID === yourPersonalInfo.seatbelt_helmet);
      //         if (optionToSet) {
      //             optionToSet.Selected = true;
      //         }
      //     }
      // }
      const optionToSet = options.find(x => x.ID === savedOption);
      if (optionToSet) {
        optionToSet.Selected = true;
      }
      return options;
    } catch (err) {
      this.logger.error("PersonalInfoService::getSeatbeltOptions", err);
    }
  }

  private async getLiquorOptions(optionSeleted) {
    try {
      const liquorSavedOptions = await this.storage.getBulkARFormInputs([
        this.formInputKeyMapping.LiquorSuspected,
        this.formInputKeyMapping.LiquorTested,
      ]);
      ///const liquorSuspectedSavedOption = liquorSavedOptions[this.formInputKeyMapping.LiquorSuspected];
      //const liquorTestedSavedOption = liquorSavedOptions[this.formInputKeyMapping.LiquorTested];
      const options = this.pageBuilder.liqourDrugUseOptions();
      // if (liquorSuspectedSavedOption && liquorTestedSavedOption) {
      //     let seatbeltOption = 0;
      //     if (liquorTestedSavedOption === 1 && liquorSuspectedSavedOption === 1) {
      //         seatbeltOption = 1;
      //     } else if (liquorTestedSavedOption === 2 && liquorSuspectedSavedOption === 1) {
      //         seatbeltOption = 2;
      //     } else if (liquorTestedSavedOption === 2 && liquorSuspectedSavedOption === 2) {
      //         seatbeltOption = 3;
      //     }
      //     if (seatbeltOption) {
      //         const optionToSet = options.find(x => x.ID === seatbeltOption);
      //         if (optionToSet) {
      //             optionToSet.Selected = true;
      //         }
      //     }
      // }
      const optionToSet = options.find(x => x.ID === optionSeleted);
      if (optionToSet) {
        optionToSet.Selected = true;
      }

      return options;
    } catch (err) {
      this.logger.error("PersonalInfoService::getLiquorOptions", err);
    }
  }

  private async getGenericOptions(options: IIconRadioOption[], key: number) {
    // const savedOption = await this.storage.getARFormInput(key);
    // if (savedOption) {
    //     const optionToSet = options.find(x => x.ID === savedOption);
    //     if (optionToSet) {
    //         optionToSet.Selected = true;
    //     }
    // }
    console.log(key);
    const optionToSet = options.find(x => x.ID === key);
    if (optionToSet) {
      //alert("ss")
      optionToSet.Selected = true;
    }
    return options;
  }

  private async scanSmartId(forms: {
    PersonalInfo: FormGroup;
    GeneralInfo: FormGroup;
    LicenseInfo: FormGroup;
  }) {
    // this.camera.openCamera().then(data => {
    //     this.userprofile = data;
    //     console.log(data)
    //   })
    try {
      const scanResult = await this.scanner.scanSmartId();
      console.log(JSON.stringify(scanResult), "scan result 596");
      if (scanResult) {
        forms.PersonalInfo.get("FullName").setValue(scanResult.Data.FullName);
        forms.PersonalInfo.get("Surname").setValue(scanResult.Data.Surname);
        forms.PersonalInfo.get("Initials").setValue(scanResult.Data.Initials);
        forms.GeneralInfo.get("IDNumber").setValue(scanResult.Data.IDNumber);
        forms.GeneralInfo.get("CountryOfOrigin").setValue(
          scanResult.Data.CountryOfOrigin
        );
        forms.GeneralInfo.get("Gender").setValue(scanResult.Data.Gender);
        if (forms.PersonalInfo.get("Age")) {
          forms.PersonalInfo.get("Age").setValue(scanResult.Data.Age);
        }
      } else if (!scanResult) {
        await this.global.toast(scanResult.Error);
      }
    } catch (err) {
      this.logger.error("PersonalInfoService::scanSmartId", err);
    }
  }

  private async populateInfo(formGroup: FormGroup) {
    try {
      const keysToRetrieve = [];
      for (const control in formGroup.controls) {
        if (!this.formInputKeyMapping[control]) {
          continue;
        }
        keysToRetrieve.push(this.formInputKeyMapping[control]);
      }
      const savedValues = await this.storage.getBulkARFormInputs(
        keysToRetrieve
      );
      for (const control in formGroup.controls) {
        if (!this.formInputKeyMapping[control]) {
          continue;
        }
        if (savedValues[this.formInputKeyMapping[control]]) {
          formGroup
            .get(control)
            .setValue(savedValues[this.formInputKeyMapping[control]]);
        }
      }
    } catch (err) {
      this.logger.error("PersonalInfoService::populateInfo", err);
    }
  }

  private async saveInfo(formControls: any) {
    try {
      const inputsToSave = {};
      for (const key in formControls) {
        if (!this.formInputKeyMapping[key]) {
          continue;
        }
        inputsToSave[this.formInputKeyMapping[key]] = formControls[key];
      }
      await this.storage.insertBulkARFormInputs(inputsToSave);
    } catch (err) {
      this.logger.error("PersonalInfoService::saveInfo", err);
    }
  }
}
