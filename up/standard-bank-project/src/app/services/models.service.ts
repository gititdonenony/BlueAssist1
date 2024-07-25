import { GeocoderResult } from '@ionic-native/google-maps/ngx';

export interface ILocationInformation {
    Lat: number;
    Lon: number;
    Address?: string;
    LocationObject?: GeocoderResult;
    ShareableMap?: string;
}

export interface IIconRadioOption {
    Description: string;
    Image?: string;
    ImageBase?: string;
    ImageColor?: string;
    Selected?: boolean;
    ID: any;
}

export interface IPassengerSavedInfo {
    ID: number;
    Info: IPassengerInfo;
}

export interface IPassengerInfo {
    IDNumber: string;
    CountryOfOrigin?: string;
    Surname: string;
    Initials?: string;
    Age?: number;
    HomeAddress?: string;
    CellNumber: string;
    Race?: number;
    Gender?: number;
    DriverInjured: number;
    SeatbeltFitted?: number;
    SeatbeltUsed?: number;
    LiquorSuspected?: number;
    LiquorTested?: number;
}

export interface IPassenger {
    ID?: number;
    InjuryType: SeverityOfInjury;
    Name: string;
}

export enum SeverityOfInjury {
    Killed = 1,
    Serious = 2,
    Slight = 3,
    NoInjury = 4
}

export interface ICameraCaptureInfo {
    FullPath: string;
    Directory: string;
    FileName: string;
    Base64: string;
    ImageSource: string;
    ThumbnailDirectory: string;
}

export interface IImageSavedEvent {
    CaptureInfo: ICameraCaptureInfo;
    StorageKey: string;
}

export interface IDamageCapture {
    Title: string;
    Description: string;
    Icon: string;
    Base64?: string;
    Collapsed?: boolean;
    FieldId: number;
}

export interface IButtonInformation {
    Text: string;
    ButtonName: string;
    Icon: string;
    IconInverse: string;
    State: number;
}

export interface IArFormHistory {
    AccidentType: string;
    AccidentDate: string;
    OtherDriverFullName: string;
    LocationOfAccident: string;
    FormId: string;
}

export interface IArFormHistoryDetails {
    FormId: string;
    ArFormDownloadLink: string;
    SnapsDownloadLink: string;
    ArFormDirectoryUri?: string;
    ArFormFileUri?: string;
}

export interface IUserModel {
    Id: string;
    Name: string;
    Surname: string;
    Email: string;
    IdNumber: string;
}
