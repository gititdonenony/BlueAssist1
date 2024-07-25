import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { NavController } from "@ionic/angular";

import { StorageService, Tables } from "../../../../services/storage.service";
import { ValidateDateNotInFuture } from "../../../../services/formvalidators.service";
import { GlobalService } from "../../../../services/global.service";
import { MessageBusService } from "../../../../services/messagebus.service";
import { LoggerService } from "../../../../services/logger.service";

import { Subscription } from "rxjs";

import { GenericPopupPage } from "src/app/generic-popup/generic-popup.page";
import { ArFormSubmitterPage } from "src/modals/ar-form-submitter/ar-form-submitter.page";
import moment from "moment";
import { IUserModel } from "src/app/services/models.service";
import { ClaimService } from "src/app/services/claim.service";
import { SubmitEmail } from "src/app/pages/tabs/Model/claim.model";

@Injectable()
export class SubmitAndEmailService {
  private formSubscription: Subscription;
  private fieldIdKeyMapping = {
    AccidentDate: 1,
    AccidentTime: 4,
    SpeedLimit: 6,
    Email: -1,
  };
  private form: FormGroup;

  constructor(
    private storage: StorageService,
    private nav: NavController,
    private global: GlobalService,
    private messageBus: MessageBusService,
    private logger: LoggerService,
    private claimService: ClaimService,

  ) { }


  returnCureentDate() {
    return (new Date()).toISOString();
  }



  buildForm(): FormGroup {
    // this.form = new FormGroup({
    //   AccidentDate: new FormControl(moment(new Date()).format("DD MMM YYYY"), {
    //     updateOn: "blur",
    //     validators: [Validators.required, ValidateDateNotInFuture],
    //   }),
    //   AccidentTime: new FormControl(moment(new Date()).format("HH:mm"), {
    //     updateOn: "blur",
    //     validators: Validators.required,
    //   }),
    //   SpeedLimit: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: Validators.required,
    //   }),
    //   Email: new FormControl("", {
    //     updateOn: "blur",
    //     validators: [Validators.required, Validators.email],
    //   }),
    // });
    //?New Form Validation
    this.form = new FormGroup({
      AccidentDate: new FormControl("", {
        updateOn: "blur",
        validators: [Validators.required, ValidateDateNotInFuture],
      }),
      AccidentTime: new FormControl("", {
        updateOn: "blur",
        validators: Validators.required,
      }),
      SpeedLimit: new FormControl(null, {
        updateOn: "blur",
        validators: Validators.required,
      }),
      Email: new FormControl("", {
        updateOn: "blur",
        validators: [Validators.required, Validators.email],
      }),
    });


    this.formSubscription = this.form.valueChanges.subscribe(async x => {
      await this.saveForm(x);
    });
    (async (formToPopulate: FormGroup) => {
      await this.populateForm(formToPopulate);
    })(this.form);

    return this.form;
  }

  async finish(popOnly: boolean) {
    this.formSubscription.unsubscribe();

    if (popOnly) {
      await this.nav.pop();
      return;
    }

    // const emailValid = this.form.get("Email").valid;
    // if (!emailValid) {
    //   await this.global.toast("Please enter a valid email address");
    //   return;
    // }
    

    const doneModal = await this.global.modal(
      GenericPopupPage,
      {
        header: "Click Submit",
        description: [
          "you should receive an email in the <br>next few minutes  .",
        ],
        title: "Email submition!",
        image: "assets/imgs/email.png",
        continueButtonText: "Submit",
      },
      "small-popup"
    );
    const result = await doneModal.onDidDismiss();
    if (result.data) {
      await this.nav.pop();
      await this.global.modal(ArFormSubmitterPage, null, "small-popup", true);
    }
  }

  broadcastCompletionState(completionState: number) {
    this.messageBus.sendMessageToHomePageMessageBus({
      State: completionState,
      TargetButton: "SubmitAndEmail",
    });
  }

  async SaveSubmitEmail(submitEmail: SubmitEmail) {
    var token = await this.storage.get("WbAuth");
    var claim_id = await this.storage.get("ClaimAuth");
    //console.log(token, claim_id, "SaveSubmitEmail()");
    if (token != "" && claim_id != "") {
      var claimSeen: any[] = [];
      //    console.log(claimSeen, claimSeen.length);
      claimSeen = JSON.parse(localStorage.getItem("claimSeen"));
      if (claimSeen && claimSeen.length > 0) {
        claimSeen.push(claim_id);
        localStorage.setItem("claimSeen", JSON.stringify(claimSeen));
      } else {
        var claim_id = await this.storage.get("ClaimAuth");
        let ele = [];
        ele[0] = claim_id;
        localStorage.setItem("claimSeen", JSON.stringify(ele));
      }

      //console.log(token);
      submitEmail.claim_id = claim_id;
      let response = this.claimService.AddSubmitEmail(token, submitEmail);
      //console.log(submitEmail);
      response.subscribe(result => {
        //console.log(result);
        return result;
      });
      // this.form.reset({ AccidentDate: "" });
      // this.form.reset();
      // this.form.markAsPristine();
      // this.form.markAsUntouched();
      // this.form.updateValueAndValidity();
    }
   
  }

  clearForm() {
    this.form.reset({ AccidentDate: "" });
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
  }

  private async populateForm(form: FormGroup) {
    try {
      const keysToRetrieve = [];
      for (const key in form.controls) {
        if (this.fieldIdKeyMapping[key]) {
          keysToRetrieve.push(this.fieldIdKeyMapping[key]);
        }
      }
      const savedInfo = await this.storage.getBulkARFormInputs(keysToRetrieve);
      for (const key in form.controls) {
        if (this.fieldIdKeyMapping[key]) {
          if (savedInfo[this.fieldIdKeyMapping[key]]) {
            form.get(key).setValue(savedInfo[this.fieldIdKeyMapping[key]]);
          }
        }
      }

      if (!form.get("Email").value) {
        const userDetails: IUserModel = await this.storage.get(
          Tables.UserDetails
        );
        if (userDetails) {
          form.get("Email").setValue(userDetails.Email);
        }
      }
    } catch (err) {
      this.logger.error("SubmitAndEmailService::populateForm", err);
    }
  }

  private async saveForm(data: any) {
    try {
      const infoToSave = {};
      for (const key in data) {
        if (this.fieldIdKeyMapping[key]) {
          if (key === "AccidentDate") {
            await this.setAccidentDayOfWeek(data[key]);
          }
          infoToSave[this.fieldIdKeyMapping[key]] = data[key];
        }
      }
      await this.storage.insertBulkARFormInputs(infoToSave);
    } catch (err) {
      this.logger.error("SubmitAndEmailService::saveForm", err);
    }
  }

  private async setAccidentDayOfWeek(date: any) {
    try {
      const dayOfWeek = moment(date).day() + 1;
      await this.storage.setARFormInput(2, dayOfWeek);
    } catch (err) {
      this.logger.error("SubmitAndEmailService::setAccidentDayOfWeek", err);
    }
  }
}
