import { ClaimsClickService } from "./../../../../../../services/claims-click.service";
import { Component, OnInit, OnDestroy } from "@angular/core";

import { SnapService } from "./snap.service";
import { IButtonInformation } from "../../../../../../services/models.service";

import { Subscription } from "rxjs";
import { AccidentSceneService } from "src/app/pages/accident-reporting/snap/accident-scene/accident-scene.service";
import { YourVehicleDamagesService } from "src/app/pages/accident-reporting/snap/your-vehicle-damages/your-vehicle-damages.service";
import { OtherVehicleDamagesService } from "src/app/pages/accident-reporting/snap/other-vehicle-damages/other-vehicle-damages.service";
import { RoadConditionsService } from "src/app/pages/accident-reporting/snap/road-conditions/road-conditions.service";
import { isEmpty } from "rxjs/operators";

@Component({
  selector: "app-snap",
  templateUrl: "./snap.component.html",
  styleUrls: ["./snap.component.scss"],
  providers: [SnapService],
})
export class SnapComponent implements OnInit, OnDestroy {
  states: any = {};
  homePageSubscription: Subscription;
  buttons: IButtonInformation[] = [];

  constructor(
    private service: SnapService,
    private claimClickService: ClaimsClickService,
    private accidentService: AccidentSceneService,
    private vehicleDamageService: YourVehicleDamagesService,
    private othrVechicleDamageService: OtherVehicleDamagesService,
    private roadConditionService: RoadConditionsService
  ) {
    this.GetOtherDriverInfo();
    this.GetVehicleDamage();
    this.GetTheirVehicleDamage();
    this.getRoadCondition();
  }

  //! to get status of buttons
  async GetOtherDriverInfo() {
    //console.log("mama mia from GetOtherDriverInfo");
    var response = await this.accidentService.GetAccidentScene();
    response.subscribe(async (result: any) => {
      //console.log(result);
      if (result.operation == "success") {
        let isEmpty = false;
        for (var key in result.data) {
          if (result.data[key] === "") {
            isEmpty = true;
            break;
          }
        }
        //console.log(isEmpty);
        if (isEmpty) {
          this.buttons.map(e => {
            if (e.ButtonName == "AccidentScene") {
              e.State = 1;
            }
          });
        } else {
          this.buttons.map(e => {
            if (e.ButtonName == "AccidentScene") {
              e.State = 2;
            }
          });
        }
      } else {
        this.buttons.map(e => {
          if (e.ButtonName == "AccidentScene") {
            e.State = 0;
          }
        });
      }
    });
  }
  async GetVehicleDamage() {
    //console.log("hi i am GetVehicleDamage");
    var response = await this.vehicleDamageService.GetYourVehicleDamage();
    response.subscribe(async (result: any) => {
      if (result.operation == "success") {
        let isEmpty = false;
        for (var key in result.data) {
          if (result.data[key] === "") {
            isEmpty = true;
            break;
          }
        }
        //console.log(isEmpty);
        if (isEmpty) {
          this.buttons.map(e => {
            if (e.ButtonName == "YourVehicleDamage") {
              e.State = 1;
            }
          });
        } else {
          this.buttons.map(e => {
            if (e.ButtonName == "YourVehicleDamage") {
              e.State = 2;
            }
          });
        }
      } else {
        this.buttons.map(e => {
          if (e.ButtonName == "YourVehicleDamage") {
            e.State = 0;
          }
        });
      }
    });
  }
  async GetTheirVehicleDamage() {
    //console.log("GetTheirVehicleDamage getting called bro!");
    var response = await this.othrVechicleDamageService.GetTheirVehicleDamage();
    response.subscribe(async (result: any) => {
      //console.log(result);
      if (result.operation == "success") {
        let isEmpty = false;
        for (var key in result.data) {
          if (result.data[key] === "") {
            isEmpty = true;
            break;
          }
        }
        //console.log(isEmpty);
        if (isEmpty) {
          this.buttons.map(e => {
            if (e.ButtonName == "TheirVehicleDamage") {
              e.State = 1;
            }
          });
        } else {
          this.buttons.map(e => {
            if (e.ButtonName == "TheirVehicleDamage") {
              e.State = 2;
            }
          });
        }
      } else {
        this.buttons.map(e => {
          if (e.ButtonName == "TheirVehicleDamage") {
            e.State = 0;
          }
        });
      }
    });
  }
  async getRoadCondition() {
    var response = await this.roadConditionService.getRoadCondition();
    response.subscribe(async (result: any) => {
      //console.log(result);
      if (result.operation == "success") {
        let isEmpty = false;
        for (var key in result.data) {
          if (result.data[key] === "") {
            isEmpty = true;
            break;
          }
        }
        //console.log(isEmpty);
        if (isEmpty) {
          this.buttons.map(e => {
            if (e.ButtonName == "RoadConditions") {
              e.State = 1;
            }
          });
        } else {
          this.buttons.map(e => {
            if (e.ButtonName == "RoadConditions") {
              e.State = 2;
            }
          });
        }
      } else {
        this.buttons.map(e => {
          if (e.ButtonName == "RoadConditions") {
            e.State = 0;
          }
        });
      }
    });
  }
  //! to get status of buttons end

  async ngOnInit() {
    this.buttons = await this.service.getButtons();
    this.states = await this.service.getStates();
    this.homePageSubscription = this.service
      .subscribeToPageEvents()
      .subscribe(async data => {
        //console.log(data,"data from snap");
        this.states[data.TargetButton] = data.State;
        await this.service.saveStates(this.states);
        this.buttons = await this.service.getButtons();
      });
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
