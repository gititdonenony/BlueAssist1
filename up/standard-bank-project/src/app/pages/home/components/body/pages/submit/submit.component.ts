import { Component, OnInit, OnDestroy } from "@angular/core";

import { SubmitService, PageAnimations } from "./submit.service";

import { Subscription } from "rxjs";
import {
  IButtonInformation,
  IIconRadioOption,
} from "../../../../../../services/models.service";
import { SpecialObservationsService } from "src/app/pages/accident-reporting/submit/special-observations/special-observations.service";
import { DangerousGoodsService } from "src/app/pages/accident-reporting/submit/dangerous-goods/dangerous-goods.service";
import { FormGroup } from "@angular/forms";
import { SubmitAndEmailService } from "src/app/pages/accident-reporting/submit/submit-and-email/submit-and-email.service";

@Component({
  selector: "app-submit",
  templateUrl: "./submit.component.html",
  styleUrls: ["./submit.component.scss"],
  animations: PageAnimations,
  providers: [SubmitService],
})
export class SubmitComponent implements OnInit, OnDestroy {
  states: any = {};
  homePageSubscription: Subscription;
  buttons: IButtonInformation[] = [];

  radioOptions: {
    TrappedOptions: IIconRadioOption[];
    UseOfCellphone: IIconRadioOption[];
  };
  radioOptions2: {
    GoodsCarriedOptions: IIconRadioOption[];
    SpillageOptions: IIconRadioOption[];
    GasEmissionOptions: IIconRadioOption[];
    PlacardOptions: IIconRadioOption[];
  };
  submissionForm: FormGroup;
  
  constructor(
    private service: SubmitService,
    private specialObservationService: SpecialObservationsService,
    private dangerousGoodsService: DangerousGoodsService,
    private submitAndEmailservice: SubmitAndEmailService,
  ) {}
  //! to get button state
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
    //console.log(this.buttons);
    this.buttons.map(b => {
      if (b.ButtonName == "SpecialObservations") {
        b.State = nothingCompleted ? 0 : allComplete ? 2 : 1;
      }
    });
  }
  private calculateCompletionStateOfDangerousGoods() {
    let allComplete = true;
    let nothingCompleted = true;
    for (const key in this.radioOptions) {
      if (this.radioOptions[key].filter(x => x.Selected).length === 0) {
        allComplete = false;
      } else {
        nothingCompleted = false;
      }
    }
    //console.log(this.buttons);
    this.buttons.map(b => {
      if (b.ButtonName == "DangerousGoods") {
        b.State = nothingCompleted ? 0 : allComplete ? 2 : 1;
      }
    });
  }
  //! to get button state END

  async ngOnInit() {
    this.buttons = await this.service.getButtons();
    this.states = await this.service.getStates();
    this.homePageSubscription = this.service
      .subscribeToPageEvents()
      .subscribe(async data => {
        this.states[data.TargetButton] = data.State;
        await this.service.saveStates(this.states);
        this.buttons = await this.service.getButtons();
      });

      //? to get btn state
    this.radioOptions = await this.specialObservationService.initialize();
    this.radioOptions2 = await this.dangerousGoodsService.initialize();
    if (
      this.radioOptions.TrappedOptions.length ||
      this.radioOptions.UseOfCellphone.length
    ) {
      this.calculateCompletionState();
    } else {
      this.buttons.map(b => {
        if (b.ButtonName == "SpecialObservations") {
          b.State = 0;
        }
      });
    }
    if (
      this.radioOptions2.GoodsCarriedOptions.length ||
      this.radioOptions2.SpillageOptions.length ||
      this.radioOptions2.GasEmissionOptions.length ||
      this.radioOptions2.PlacardOptions.length
    ) {
      this.calculateCompletionStateOfDangerousGoods();
    } else {
      this.buttons.map(b => {
        if (b.ButtonName == "DangerousGoods") {
          b.State = 0;
        }
      });
    }

    this.submissionForm = this.submitAndEmailservice.buildForm();
    const completionState = this.submissionForm.valid ? 2 : 1;
    this.submitAndEmailservice.broadcastCompletionState(completionState);
  }

  ngOnDestroy() {
    if (this.homePageSubscription) {
      this.homePageSubscription.unsubscribe();
    }
  }

  async goBack() {
    await this.service.goBack();
  }

  async navigateToPage(page: string) {
    await this.service.navigateToPage(page);
  }
}
