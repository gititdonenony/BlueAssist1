import { Injectable, EventEmitter } from "@angular/core";

import { Observable } from "rxjs";

import { ICameraCaptureInfo, IImageSavedEvent } from "./models.service";

@Injectable()
export class MessageBusService {
  private homePageMessageBus: EventEmitter<HomePageMessageBus> =
    new EventEmitter();
  private sliderAutoHeightMessageBus: EventEmitter<any> = new EventEmitter();
  private cameraMessageBus: EventEmitter<ICameraCaptureInfo> =
    new EventEmitter();
  private imageSavedMessageBus: EventEmitter<IImageSavedEvent> =
    new EventEmitter();
  private passengerPageBus: EventEmitter<any> = new EventEmitter();
  private userLoginStatusChangeMessageBus: EventEmitter<any> =
    new EventEmitter();
  private emergencyToggleMessageBus: EventEmitter<any> = new EventEmitter();
  private keyboardToggleMessageBus: EventEmitter<boolean> = new EventEmitter();
  private drivingLicenseMessageBus: EventEmitter<any> = new EventEmitter();
  private locationPromptMessageBus: EventEmitter<any> = new EventEmitter();

  constructor() {}

  promptLocation() {
    this.locationPromptMessageBus.emit();
  }
  subscribeToLocationPromptMessageBus(): Observable<any> {
    return this.locationPromptMessageBus.asObservable();
  }

  subscribeToUserLoginChange(): Observable<any> {
    return this.userLoginStatusChangeMessageBus.asObservable();
  }
  sendMessageToUserLoginChangeMessageBus() {
    this.userLoginStatusChangeMessageBus.emit();
  }

  subscribeToKeyboardToggle(): Observable<boolean> {
    return this.keyboardToggleMessageBus.asObservable();
  }

  toggleKeyBoard(isOpen: boolean) {
    this.keyboardToggleMessageBus.emit(isOpen);
  }

  subscribeToDlData(): Observable<any> {
    return this.drivingLicenseMessageBus.asObservable();
  }

  toggleDlDataStatus(data: any) {
    this.drivingLicenseMessageBus.emit(data);
  }

  subscribeToHomePageMessageBus(): Observable<HomePageMessageBus> {
    return this.homePageMessageBus.asObservable();
  }
  sendMessageToHomePageMessageBus(message: HomePageMessageBus) {
    setTimeout(() => {
      this.homePageMessageBus.emit(message);
    }, 500);
  }

  subscribeToSliderAutoHeightMessageBus(): Observable<any> {
    return this.sliderAutoHeightMessageBus.asObservable();
  }
  autoAdjustSliderHeight() {
    this.sliderAutoHeightMessageBus.emit();
  }

  subscribeToCameraCapturePage(): Observable<ICameraCaptureInfo> {
    return this.cameraMessageBus.asObservable();
  }
  sendCameraCaptureInfo(info: ICameraCaptureInfo) {
    this.cameraMessageBus.emit(info);
  }

  subscribeToImageSavedEvent(): Observable<IImageSavedEvent> {
    return this.imageSavedMessageBus.asObservable();
  }
  emitImageSavedEvent(imageSaveEvent: IImageSavedEvent) {
    this.imageSavedMessageBus.emit(imageSaveEvent);
  }

  subscribeToPassengerPage(): Observable<any> {
    return this.passengerPageBus.asObservable();
  }
  sendPassengerPageMessage(message: any) {
    setTimeout(() => {
      this.passengerPageBus.emit(message);
    }, 500);
  }

  subscribeToEmergencyToggleMessageBus(): Observable<any> {
    return this.emergencyToggleMessageBus.asObservable();
  }
  toggleEmergency() {
    this.emergencyToggleMessageBus.emit();
  }
}

export interface HomePageMessageBus {
  TargetButton: string;
  State: number;
  GoToNext?: string;
}
