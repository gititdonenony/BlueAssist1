import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";

import { ScanService } from "./scan.service";
import { Subscription } from "rxjs";
import { IButtonInformation } from "../../../../../../services/models.service";
import { PersonalInfoService } from "src/app/pages/accident-reporting/scan/shared-services/personal-info.service";
// src\app\pages\accident-reporting\scan\shared-services\personal-info.service.ts
import { OtherVehicleInfoService } from "src/app/pages/accident-reporting/scan/other-vehicle-info/other-vehicle-info.service";
import { YourVehicleInfoService } from "src/app/pages/accident-reporting/scan/your-vehicle-info/your-vehicle-info.service";
import { WitnessInfoService } from "src/app/pages/accident-reporting/scan/witness-info/witness-info.service";
import { PassengerInfoService } from "src/app/pages/accident-reporting/scan/passenger-info/passenger-info.service";
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { NavController} from "@ionic/angular";


@Component({
  selector: "app-scan",
  templateUrl: "./scan.component.html",
  styleUrls: ["./scan.component.scss"],
  providers: [ScanService],
})
export class ScanComponent implements OnInit, OnDestroy {
  states: any = {};
  homePageSubscription: Subscription;
  buttons: IButtonInformation[] = [];

  @ViewChild("wrapper", { static: true }) wrapper: ElementRef;


  public content_visibility: any;
  public scannedResult: any;
  public page: string;

  constructor(
    private service: ScanService,
    private personalInfoService: PersonalInfoService,
    private otherVehicleInfoService: OtherVehicleInfoService,
    private yourVehicleInfoService: YourVehicleInfoService,
    private witnessInfoService: WitnessInfoService,
    private passengerInfoService: PassengerInfoService,
    private navController: NavController
  ) {
    this.GetOtherDriverInfo();
    this.getOtherVehicleInfo();
    this.getYourInfo();
    this.geYourVehicleInfo();
    this.getWitnessInfo();
    this.passengerInfo("passenger");
    this.passengerInfo("cyclist");
    this.passengerInfo("pedestrian");
  }

  // ! to get button state
  async GetOtherDriverInfo() {
    var response = await this.personalInfoService.GetOtherDriverInfo();
    response.subscribe(async (result: any) => {
      //console.log(result, this.buttons);
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
            if (e.ButtonName == "OtherDriverInfo") {
              e.State = 1;
            }
          });
        } else {
          this.buttons.map(e => {
            if (e.ButtonName == "OtherDriverInfo") {
              e.State = 2;
            }
          });
        }
      } else {
        this.buttons.map(e => {
          if (e.ButtonName == "OtherDriverInfo") {
            e.State = 0;
          }
        });
      }
    });
  }
  async getOtherVehicleInfo() {
    var response =
      await this.otherVehicleInfoService.GetOtherDriveVehicleInfo();
    response.subscribe(async (result: any) => {
      //console.log(result, this.buttons);
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
            if (e.ButtonName == "OtherVehicleInfo") {
              e.State = 1;
            }
          });
        } else {
          this.buttons.map(e => {
            if (e.ButtonName == "OtherVehicleInfo") {
              e.State = 2;
            }
          });
        }
      } else {
        this.buttons.map(e => {
          if (e.ButtonName == "OtherVehicleInfo") {
            e.State = 0;
          }
        });
      }
    });
  }
  async getYourInfo() {
    var response = await this.personalInfoService.GetYourPersonalInfo();
    response.subscribe(async (result: any) => {
      //console.log(result, this.buttons);
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
            if (e.ButtonName == "YourInfo") {
              e.State = 1;
            }
          });
        } else {
          this.buttons.map(e => {
            if (e.ButtonName == "YourInfo") {
              e.State = 2;
            }
          });
        }
      } else {
        this.buttons.map(e => {
          if (e.ButtonName == "YourInfo") {
            e.State = 0;
          }
        });
      }
    });
  }
  async geYourVehicleInfo() {
    var response = await this.yourVehicleInfoService.GetYourVihicleInfo();
    response.subscribe(async (result: any) => {
      //console.log(result, this.buttons);
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
            if (e.ButtonName == "YourVehicleInfo") {
              e.State = 1;
            }
          });
        } else {
          this.buttons.map(e => {
            if (e.ButtonName == "YourVehicleInfo") {
              e.State = 2;
            }
          });
        }
      } else {
        this.buttons.map(e => {
          if (e.ButtonName == "YourVehicleInfo") {
            e.State = 0;
          }
        });
      }
    });
  }
  async getWitnessInfo() {
    var response = await this.witnessInfoService.GetWitnessPersonalInfo();
    response.subscribe((result: any) => {
      //console.log(result, this.buttons);
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
            if (e.ButtonName == "WitnessInfo") {
              e.State = 1;
            }
          });
        } else {
          this.buttons.map(e => {
            if (e.ButtonName == "WitnessInfo") {
              e.State = 2;
            }
          });
        }
      } else {
        this.buttons.map(e => {
          if (e.ButtonName == "WitnessInfo") {
            e.State = 0;
          }
        });
      }
    });
  }
  async passengerInfo(type: string) {
    const result = await this.passengerInfoService.initialize(type);
    //console.log(result,"from passenger info");
    if (result && result.length >= 1) {
      if (type == "passenger") {
        this.buttons.map(e => {
          if (e.ButtonName == "PassengerInfo") {
            e.State = 2;
          }
        });
      } else if (type == "cyclist") {
        this.buttons.map(e => {
          if (e.ButtonName == "CyclistInfo") {
            e.State = 2;
          }
        });
      } else if (type == "pedestrian") {
        this.buttons.map(e => {
          if (e.ButtonName == "PedestrianInfo") {
            e.State = 2;
          }
        });
      }
    } else {
      if (type == "passenger") {
        this.buttons.map(e => {
          if (e.ButtonName == "PassengerInfo") {
            e.State = 0;
          }
        });
      } else if (type == "cyclist") {
        this.buttons.map(e => {
          if (e.ButtonName == "CyclistInfo") {
            e.State = 0;
          }
        });
      } else if (type == "pedestrian") {
        this.buttons.map(e => {
          if (e.ButtonName == "PedestrianInfo") {
            e.State = 0;
          }
        });
      }
    }
    //console.log(result);
  }
  // ! to get button state end

  async ngOnInit() {
    this.buttons = await this.service.getButtons();
    this.states = await this.service.getStates();
    this.homePageSubscription = this.service
      .subscribeToPageEvents()
      .subscribe(async data => {
        this.states[data.TargetButton] = data.State;
        await this.service.saveStates(this.states);
        this.buttons = await this.service.getButtons();
        console.log(this.buttons);
      });


    this.content_visibility = await this.service.content_visibility;


  }

  ionViewDidEnter() {
    this.activateScrollCollapse();
  }

  activateScrollCollapse() {
    const elem: HTMLDivElement = this.wrapper.nativeElement as HTMLDivElement;

    const scrollCollapse: HTMLDivElement = document.querySelector(
      ".scroll-collapse"
    ) as HTMLDivElement;
    const header: HTMLElement = scrollCollapse.querySelector(".header");
    const subheader: HTMLElement = scrollCollapse.querySelector(".content");

    elem.onscroll = (ev: Event) => {
      let scrollPercentage = elem.scrollTop / 60;
      if (scrollPercentage > 1) {
        scrollPercentage = 1;
      } else if (scrollPercentage < 0) {
        scrollPercentage = 0;
      }
      scrollCollapse.style.transform = `translateY(-${40 * scrollPercentage
        }px)`;
      scrollCollapse.style.boxShadow = `1px 0px 8px rgba(0, 0, 0, ${0.1 * scrollPercentage
        })`;
      header.style.transform = `scale(${1 - 0.3 * scrollPercentage
        }) translateY(${45 * scrollPercentage}px)`;
      subheader.style.transform = `scale(${1 - scrollPercentage})`;
      subheader.style.opacity = `${1 - 1 * scrollPercentage}`;
    };
  }

  async goBack() {
    await this.service.goBack();
  }





  async navigateToPage(page: string) {
    console.log('page---------->>>>>>', page)
    this.page = page
    const modalData = await this.service.navigateToPage(page);
    console.log('modalData---------->>>>>>', modalData)
    if (modalData === true) {
      this.startScan();
    }
  }
  public stop(): void {
    this.navController.pop();
  }


  async checkPermission() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  }

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if (!permission) {
        return;
      }
      await BarcodeScanner.hideBackground();
      document.querySelector('body').classList.add('scanner-active');
      this.content_visibility = 'hidden';
      const result = await BarcodeScanner.startScan();
      // console.log('result--------->>',result);
      BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active');
      this.content_visibility = '';
      if (result?.hasContent) {
        this.scannedResult = result.content;

        console.log('scannedResult--------->>', this.scannedResult);

        if (this.page === 'OtherDriverInfo') {
          if (this.scannedResult.includes('|')) {
            let scannedData = this.scannedResult.split('|');
            if (scannedData?.length > 0) {
              localStorage.setItem(`scannedData_${this.page}`, JSON.stringify(scannedData));
            }
          }

        } else if (this.page === 'OtherVehicleInfo') {
          if (this.scannedResult.includes('%')) {
            let scannedData = this.scannedResult.split('%');
            if (scannedData?.length > 0) {
              localStorage.setItem(`scannedData_${this.page}`, JSON.stringify(scannedData));
            }
          }
        } else if (this.page === 'YourInfo') {
          if (this.scannedResult.includes('|')) {
            let scannedData = this.scannedResult.split('|');
            if (scannedData?.length > 0) {
              localStorage.setItem(`scannedData_${this.page}`, JSON.stringify(scannedData));
            }
          }

        } else if (this.page === 'YourVehicleInfo') {
          if (this.scannedResult.includes('%')) {
            let scannedData = this.scannedResult.split('%');
            if (scannedData?.length > 0) {
              localStorage.setItem(`scannedData_${this.page}`, JSON.stringify(scannedData));
            }
          }
        }else if (this.page === 'WitnessInfo') {
          if (this.scannedResult.includes('|')) {
            let scannedData = this.scannedResult.split('|');
            if (scannedData?.length > 0) {
              localStorage.setItem(`scannedData_${this.page}`, JSON.stringify(scannedData));
            }
          }
        }
        
        await this.service.navigatingToPage(this.page);

      }
    } catch (e) {
      console.log(e);
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
    this.content_visibility = '';
  }

  // ngOnDestroy(): void {
  //   this.stopScan();
  // }

  ngOnDestroy() {
    this.stopScan();
    if (this.homePageSubscription) {
      this.homePageSubscription.unsubscribe();
    }

  }


}
