import { Injectable } from "@angular/core";
import { NavController } from "@ionic/angular";

import { StorageService, Prefixes } from "../../../../services/storage.service";
import { GlobalService } from "../../../../services/global.service";
import { MessageBusService } from "../../../../services/messagebus.service";
import {
  IPassenger,
  IPassengerSavedInfo,
  SeverityOfInjury,
} from "../../../../services/models.service";
import { LoggerService } from "../../../../services/logger.service";

import { Subscription } from "rxjs";

import { GenericPopupPage } from "src/modals/generic-popup/generic-popup.page";

@Injectable()
export class PassengerInfoService {
  private passengerPageSubscription: Subscription;
  passengers: IPassenger[] = [];

  private type = "";
  private storagePrefix: Prefixes;
  private savedStoragePrefix: Prefixes;

  constructor(
    private storage: StorageService,
    private global: GlobalService,
    private nav: NavController,
    private messageBus: MessageBusService,
    private logger: LoggerService
  ) {}

  async initialize(type: string) {
    try {
      this.type = type;
      this.storagePrefix =
        type === "cyclist"
          ? Prefixes.CyclistInfo
          : type === "pedestrian"
          ? Prefixes.PedestrianInfo
          : Prefixes.PassengerInfo;
      this.savedStoragePrefix =
        type === "cyclist"
          ? Prefixes.SavedCyclists
          : type === "pedestrian"
          ? Prefixes.SavedPedestrians
          : Prefixes.SavedPassengers;
      const savedInfo = await this.storage.getInstance<IPassenger[]>(
        this.storagePrefix
      );
      if (savedInfo) {
        this.passengers = savedInfo;
      }
      this.passengerPageSubscription = this.messageBus
        .subscribeToPassengerPage()
        .subscribe(async x => {
          const passengerInfo: IPassenger = x as IPassenger;
          const id = await this.extractInfo(
            passengerInfo.InjuryType,
            passengerInfo.ID
          );
          const passengerToEdit = this.passengers.find(y => y.ID === id);
          if (passengerToEdit) {
            passengerToEdit.Name = passengerInfo.Name;
          } else {
            this.passengers.push({
              ID: id,
              InjuryType: passengerInfo.InjuryType,
              Name: passengerInfo.Name,
            });
          }
          console.log(x,"from service")
          await this.storage.set(this.storagePrefix, this.passengers);
        });
      return this.passengers;
    } catch (err) {
      this.logger.error(`PassengerInfoService::initialize?${type}`, err);
      console.log(err);
    }
  }

  async launchPassengerInfoPage(editDetails?: IPassenger) {
    if (editDetails) {
      const isMinimal = editDetails.InjuryType === SeverityOfInjury.NoInjury;
      await this.preSetInfo(editDetails.InjuryType, editDetails.ID);
      await this.nav.navigateForward(
        `/accident-reporting/scan/passenger-info-capture?type=${this.type}&scan=false&minimal=${isMinimal}&injuryType=${editDetails.InjuryType}&editId=${editDetails.ID}`
      );
    } else {
      await this.nav.navigateForward(
        `/accident-reporting/scan/injury-severity-question?type=${this.type}`
      );
    }
  }

  async removePassenger(passenger: IPassenger) {
    try {
      const result = await this.global.prompt(
        `Are you sure you want to remove this ${this.type}?`
      );
      if (!result) {
        return;
      }
      const savedPassengers = await this.storage.getInstance<
        IPassengerSavedInfo[]
      >(this.savedStoragePrefix);
      const passengerToRemove = savedPassengers.find(
        x => x.ID === passenger.ID
      );
      savedPassengers.splice(savedPassengers.indexOf(passengerToRemove), 1);
      this.passengers.splice(this.passengers.indexOf(passenger), 1);
      await this.storage.set(this.savedStoragePrefix, savedPassengers);
      await this.storage.set(this.storagePrefix, this.passengers);
      await this.global.toast(
        `${this.type.substr(0, 1).toUpperCase()}${this.type.substr(1)} removed`
      );
    } catch (err) {
      this.logger.error("PassengerInfoService::removePassenger", err);
    }
  }

  async finish(onlyPop: boolean): Promise<boolean> {
    if (onlyPop) {
      await this.nav.pop();
      return false;
    }

    let nextToDo = "Please continue to completing <br>cyclist info";
    switch (this.type) {
      case "cyclist":
        nextToDo = "Please continue to completing <br>pedestrians info";
        break;
      case "pedestrian":
        nextToDo = "Please continue to completing <br> witnesses info";
        break;
    }
    const doneModal = await this.global.modal(
      GenericPopupPage,
      {
        header: "You are NOT Done!",
        description: [nextToDo],
        title: ` ${this.type.substr(0, 1).toUpperCase()}${this.type.substr(
          1
        )} Info`,
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

  broadcastState(completionState: number, shouldContinue: boolean) {
    this.passengerPageSubscription.unsubscribe();

    let targetButton = "PassengerInfo";
    switch (this.type) {
      case "cyclist":
        targetButton = "CyclistInfo";
        break;
      case "pedestrian":
        targetButton = "PedestrianInfo";
        break;
    }
    let goToNext = "CyclistInfo";
    switch (this.type) {
      case "cyclist":
        goToNext = "PedestrianInfo";
        break;
      case "pedestrian":
        goToNext = "WitnessInfo";
        break;
    }
    this.messageBus.sendMessageToHomePageMessageBus({
      State: completionState,
      TargetButton: targetButton,
      GoToNext: shouldContinue ? goToNext : "",
    });
  }

  private async preSetInfo(injuryType: SeverityOfInjury, editId: number) {
    try {
      const savedPassengers = await this.storage.getInstance<
        IPassengerSavedInfo[]
      >(this.savedStoragePrefix);
      const passengerToEdit = savedPassengers.find(x => x.ID === editId);
      const infoToSet = {};
      if (injuryType === SeverityOfInjury.NoInjury) {
        infoToSet[126] = passengerToEdit.Info.IDNumber;
        infoToSet[122] = passengerToEdit.Info.Surname;
        infoToSet[127] = passengerToEdit.Info.CellNumber;
      } else {
        infoToSet[150] = passengerToEdit.Info.IDNumber;
        infoToSet[151] = passengerToEdit.Info.CountryOfOrigin;
        infoToSet[152] = passengerToEdit.Info.Surname;
        infoToSet[153] = passengerToEdit.Info.Initials;
        infoToSet[154] = passengerToEdit.Info.Age;
        infoToSet[155] = passengerToEdit.Info.HomeAddress;
        infoToSet[159] = passengerToEdit.Info.CellNumber;
        infoToSet[160] = passengerToEdit.Info.Race;
        infoToSet[161] = passengerToEdit.Info.Gender;
        infoToSet[162] = passengerToEdit.Info.DriverInjured;
        infoToSet[163] = passengerToEdit.Info.SeatbeltFitted;
        infoToSet[164] = passengerToEdit.Info.SeatbeltUsed;
        infoToSet[165] = passengerToEdit.Info.LiquorSuspected;
        infoToSet[166] = passengerToEdit.Info.LiquorTested;
      }
      await this.storage.insertBulkARFormInputs(infoToSet);
    } catch (err) {
      this.logger.error("PassengerInfoService::preSetInfo", err);
    }
  }

  private async extractInfo(
    injuryType: SeverityOfInjury,
    editId: number
  ): Promise<number> {
    try {
      let keysToExtract = [];
      if (injuryType === SeverityOfInjury.NoInjury) {
        keysToExtract = [126, 122, 127];
      } else {
        keysToExtract = [
          150, 151, 152, 153, 154, 155, 159, 160, 161, 162, 163, 164, 165, 166,
        ];
      }
      const savedInfo = await this.storage.getBulkARFormInputs(keysToExtract);

      let storedInfo = await this.storage.getInstance<IPassengerSavedInfo[]>(
        this.savedStoragePrefix
      );
      if (!storedInfo) {
        storedInfo = [];
      } else {
        storedInfo.sort((x, y) => (y.ID > x.ID ? 1 : -1));
      }

      const maxId = storedInfo.length > 0 ? storedInfo[0].ID + 1 : 1;
      let passengerInfo: IPassengerSavedInfo = {
        ID: maxId,
        Info: {
          CellNumber: "",
          DriverInjured: injuryType,
          IDNumber: "",
          Surname: "",
        },
      };
      let alreadyExists = false;
      if (editId) {
        passengerInfo = storedInfo.find(x => x.ID === editId);
        alreadyExists = true;
      }
      const infoToDelete = [];
      const getSavedInfoValue = key => {
        infoToDelete.push(key);
        if (savedInfo[key]) {
          return savedInfo[key];
        }
        return "";
      };
      if (injuryType === SeverityOfInjury.NoInjury) {
        passengerInfo.Info.IDNumber = getSavedInfoValue(126);
        passengerInfo.Info.Surname = getSavedInfoValue(122);
        passengerInfo.Info.CellNumber = getSavedInfoValue(127);
      } else {
        passengerInfo.Info.IDNumber = getSavedInfoValue(150);
        passengerInfo.Info.CountryOfOrigin = getSavedInfoValue(151);
        passengerInfo.Info.Surname = getSavedInfoValue(152);
        passengerInfo.Info.Initials = getSavedInfoValue(153);
        passengerInfo.Info.Age = getSavedInfoValue(154);
        passengerInfo.Info.HomeAddress = getSavedInfoValue(155);
        passengerInfo.Info.CellNumber = getSavedInfoValue(159);
        passengerInfo.Info.Race = getSavedInfoValue(160);
        passengerInfo.Info.Gender = getSavedInfoValue(161);
        passengerInfo.Info.DriverInjured = getSavedInfoValue(162);
        passengerInfo.Info.SeatbeltFitted = getSavedInfoValue(163);
        passengerInfo.Info.SeatbeltUsed = getSavedInfoValue(164);
        passengerInfo.Info.LiquorSuspected = getSavedInfoValue(165);
        passengerInfo.Info.LiquorTested = getSavedInfoValue(166);
      }

      if (!alreadyExists) {
        storedInfo.push(passengerInfo);
      }

      await this.storage.set(this.savedStoragePrefix, storedInfo);

      await this.storage.deleteBulkARFormInputs(infoToDelete);

      return passengerInfo.ID;
    } catch (err) {
      this.logger.error("PassengerInfoService::extractInfo", err);
    }
  }
}
