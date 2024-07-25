import { PersonalInfoService } from "src/app/pages/accident-reporting/scan/shared-services/personal-info.service"
import { finalize } from "rxjs/operators";
import { PdfDownloaderService } from "./pdf-downloader.service";
import { AccidentSceneService } from "./../pages/accident-reporting/snap/accident-scene/accident-scene.service";
import { Injectable } from "@angular/core";

import { LoadingController, Platform } from "@ionic/angular";

import { LoggerService } from "./logger.service";

import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { Subscription } from "rxjs";
import { Camera, CameraOptions } from "@awesome-cordova-plugins/camera/ngx";
import { Storage } from "@ionic/storage";
import { MessageBusService } from "./messagebus.service";
@Injectable()
export class ScannerService {
  private backSubscription: Subscription;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private platform: Platform,
    private logger: LoggerService,
    private camera: Camera,
    private accidentSceneSerive: AccidentSceneService,
    private pdfDownloadService: PdfDownloaderService,
    private loadingctrl: LoadingController,
    private storage: Storage,
    private messageBusService: MessageBusService
  ) {}

  private subscribeToBackButton() {
    this.backSubscription = this.platform.backButton.subscribe(event => {
      console.log("Back Clicked!");
    });
  }

  private unsubscribeBackButton() {
    this.backSubscription.unsubscribe();
  }

  async scanSmartId() {
    let scanResult = {
      Success: true,
      Error: "",
      Data: {
        Surname: "",
        FullName: "",
        IDNumber: "",
        CountryOfOrigin: "",
        Gender: "",
        Initials: "",
        Age: 0,
        LicenseCode: "",
        DateOfIssue: "",
        LicenseNumber: "",
        Expires: "",
        SubId: "",
      },
    };
    try {
      this.subscribeToBackButton();
      const options: CameraOptions = {
        allowEdit: false,
        cameraDirection: this.camera.Direction.BACK,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.DATA_URL,
        mediaType: this.camera.MediaType.PICTURE,
        quality: 85,
        saveToPhotoAlbum: false,
        encodingType: this.camera.EncodingType.JPEG,
      };

      this.camera.getPicture(options).then(
        async imageData => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64 (DATA_URL):
          let base64Image = "data:image/jpeg;base64," + imageData;
          //window.alert(JSON.stringify(base64Image));
          //console.log(JSON.stringify(imageData), base64Image);
          let res = await this.accidentSceneSerive.saveImage("", {
            Base64: base64Image,
            FullPath: "nulldriving-license.jpg",
            Directory: null,
            FileName: "driving-license.jpg",
            ImageSource: "Gallery",
            ThumbnailDirectory: "nullthumbnails/",
          });
          const loader = this.loadingctrl.create({
            message: "Getting data from server",
          });
          await (await loader).present();
          res.subscribe((result: any) => {
            if (result.operation == "success") {
              this.storage.get("WbAuth").then(token => {
                let response = this.pdfDownloadService.getDlDetails(
                  { barcode: result.data.imagepath },
                  token
                );

                response
                  .pipe(
                    finalize(async () => {
                      await (await loader).dismiss();
                    })
                  )
                  .subscribe(
                    (result: any) => {
                      //console.log(JSON.stringify(result));
                      scanResult.Success = true;
                      scanResult.Data = {
                        Surname: result.data.last,
                        FullName: result.data.first,
                        IDNumber: result.data.id,
                        CountryOfOrigin: result.data.country,
                        Gender: result.data.sex,
                        Initials: "",
                        Age: this.calculateAgeFromIDNumber(result.data.dob),
                        LicenseCode: result.data.code,
                        DateOfIssue: result.data.issued,
                        LicenseNumber: result.data.license,
                        Expires: result.data.expires,
                        SubId: result.data.subId,
                      };
                      window.alert(JSON.stringify(result));
                      window.alert(JSON.stringify(scanResult));
                      this.messageBusService.toggleDlDataStatus(scanResult);
                      return scanResult;
                    },
                    err => {
                      scanResult.Success = false;
                      window.alert(JSON.stringify(err));
                      this.scanSmartId();
                    }
                  );
              });
            } else {
              window.alert("Failed to upload Image, Plesase try again later.");
              console.log(JSON.stringify(result));
            }
          });
        },
        err => {
          // Handle error
          window.alert(JSON.stringify(err));
        }
      );
    } catch (err) {
      console.log(err);
      scanResult.Success = false;
      this.logger.error("ScannerService::scanSmartId", err);
      scanResult.Error =
        "Could not start scanner. Please ensure you allowed permission to your camera.";
      return scanResult;
    }

    this.unsubscribeBackButton();
  }

  // async scanSmartId1() {
  //   let scanResult;
  //   try {
  //     this.subscribeToBackButton();
  //     scanResult = await this.barcodeScanner
  //       .scan({
  //         formats: "PDF_417,PDF417",
  //         prompt: "Please scan the back of the Smart ID",
  //         orientation: "landscape",
  //       })
  //       .then(barcodeData => {
  //         console.log("Barcode data", JSON.stringify(barcodeData));
  //         return barcodeData;
  //       })
  //       .catch(err => {
  //         console.log("Error", err);
  //         return err;
  //       });
  //     //   console.log("scan Format " + scannerResult.format);
  //     //   console.log("scan result text " + scannerResult.text);

  //     //const str = scannerResult.text;
  //     // Dim bc As ByteConverter
  //     // Dim ss As String = bc.HexFromBytes(val.GetBytes("ISO8859_1"))

  //     // ss = ss.Replace("3F3F", "00")
  //     // ss = ss.ToLowerCase

  //     function convertToHex(str) {
  //       var hex = "";
  //       var result = "";
  //       for (var i = 0; i < str.length; i++) {
  //         hex = str.charCodeAt(i).toString(16);
  //         result += hex.replace("3F3F", "00");
  //       }
  //       return console.log("hex binary string1 = " + result);
  //     }
  //     //   console.log("hello vijay");
  //     //   console.log("hex binary string2 = " + convertToHex(scannerResult.text));
  //     // decodeURIComponent(escape(badstring));

  //     // console.log("Base 64 = " +btoa(scannerResult.text));

  //     // console.log("utf-8 decodeURI = "+ decodeURI(scannerResult.text));
  //     //   if (!scannerResult.cancelled) {
  //     //     if (
  //     //       scannerResult.format !== "EAN_13" &&
  //     //       scannerResult.format !== "EAN_8" &&
  //     //       scannerResult.format !== "QR_CODE" &&
  //     //       scannerResult.format !== "PDF_417"
  //     //     ) {
  //     //       console.log("scan Format " + scannerResult);
  //     //       console.log("scan result text4" + scannerResult.text);
  //     //       scanResult.Error =
  //     //         "Incorrect barcode scanned. Please scan the back of the Smart ID";
  //     //     } else {
  //     //       const smartIDText = scannerResult.text;

  //     //       console.log(btoa("encode " + smartIDText));

  //     //       /*
  //     //                   ========== ID Parts Described ==========
  //     //                   0 -> Surname
  //     //                   1 -> Names
  //     //                   2 -> Gender
  //     //                   3 -> Nationality
  //     //                   4 -> ID Number
  //     //                   5 -> Date of Birth
  //     //                   6 -> Country of Birth
  //     //                   7 -> Immigration Status
  //     //                   8 -> Date of Issue
  //     //                   9 -> Secret Code
  //     //                   10 -> Card Number
  //     //                   11 -> Placeholders
  //     //                   ========================================
  //     //                 */
  //     //       console.log(smartIDText);
  //     //       const idParts: string[] = smartIDText.split("|");
  //     //       if (idParts.length === 12) {
  //     //         const surname = idParts[0];
  //     //         const fullName = idParts[1];
  //     //         const iDNumber = idParts[4];
  //     //         const countryOfOrigin = idParts[6];
  //     //         const gender = idParts[2].toLowerCase().startsWith("m")
  //     //           ? 1
  //     //           : idParts[2].toLowerCase().startsWith("f")
  //     //           ? 2
  //     //           : 0;
  //     //         let initials = "";
  //     //         if (fullName) {
  //     //           const fullNameParts = fullName.split(" ");
  //     //           for (const part of fullNameParts) {
  //     //             initials += part.substr(0, 1).toUpperCase();
  //     //           }
  //     //         }

  //     //         scanResult.Success = true;
  //     //         scanResult.Data = {
  //     //           Surname: surname,
  //     //           FullName: fullName,
  //     //           IDNumber: iDNumber,
  //     //           CountryOfOrigin: countryOfOrigin,
  //     //           Gender: gender.toString(),
  //     //           Initials: initials,
  //     //           Age: this.calculateAgeFromIDNumber(iDNumber),
  //     //         };
  //     //       } else {
  //     //         scanResult.Error =
  //     //           "Invalid ID barcode was scanned. Please scan the back of the Smart ID";
  //     //       }
  //     //     }
  //     //   }
  //   } catch (err) {
  //     console.log(err);
  //     this.logger.error("ScannerService::scanSmartId", err);
  //     scanResult.Error =
  //       "Could not start scanner. Please ensure you allowed permission to your camera.";
  //   }
  //   this.unsubscribeBackButton();
  //   return scanResult;
  //   console.log(scanResult);
  // }

  private calculateAgeFromIDNumber(dob: string) {
    try {
      const dateOfBirth = new Date(dob);
      const ageDifMs = Date.now() - dateOfBirth.getTime();
      const ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    } catch (err) {
      console.log(err);
      this.logger.error("ScannerService::calculateAgeFromIDNumber", err);
      return null;
    }
  }

  async scanLicenseDisk() {
    const scanResult = {
      Success: false,
      Error: "",
      Data: {
        NumberPlateNumber: "",
        LicenseDiscNumber: "",
        VehicleColor: "",
        VehicleMake: "",
        VehicleModel: "",
      },
    };

    try {
      this.subscribeToBackButton();
      const scannerResult = await this.barcodeScanner.scan({
        formats: "EAN_13,EAN_8,QR_CODE,PDF_417",
        preferFrontCamera: false,
        prompt: "Please scan the car license disc",
        showFlipCameraButton: false,
        showTorchButton: true,
        resultDisplayDuration: 0,
      });

      if (!scannerResult.cancelled) {
        if (
          scannerResult.format !== "EAN_13" ||
          "EAN_8" ||
          "QR_CODE" ||
          "PDF_417"
        ) {
          scanResult.Error =
            "Incorrect barcode scanned. Please scan the car license disc";
        } else {
          const carDiscText = scannerResult.text;
          /*
                      ========== ID Parts Described ==========
                      0  -> ''
                      1  -> ???
                      2  -> ???
                      3  -> ???
                      4  -> ???
                      5  -> License Disc Number
                      6  -> Number Plate
                      7  -> Vehicle Reg. Number
                      8  -> Description ('Hatch back')
                      9  -> Make ('Ford')
                      10 -> Model ('Focus')
                      11 -> Colour ('White / Wit')
                      12 -> VIN
                      13 -> Engine Nr.
                      14 -> Expiry Date
                      15 -> ''
                      ========================================
                    */
          const discParts: string[] = carDiscText.split("%");
          if (discParts.length === 16) {
            const numberPlate = discParts[6];
            const licenseDiscNumber = discParts[5];
            const vehicleColor = discParts[11].split("/")[0].trim();
            const vehicleMake = discParts[9];
            const vehicleModel = discParts[10];

            scanResult.Success = true;
            scanResult.Data = {
              LicenseDiscNumber: licenseDiscNumber,
              NumberPlateNumber: numberPlate,
              VehicleColor: vehicleColor,
              VehicleMake: vehicleMake,
              VehicleModel: vehicleModel,
            };
          } else {
            scanResult.Error =
              "Invalid barcode was scanned. Please scan the car license disc";
          }
        }
      }
    } catch (err) {
      console.log(err);
      this.logger.error("ScannerService::scanLicenseDisk", err);
      scanResult.Error =
        "Could not start scanner. Please ensure you allowed permission to your camera.";
    }
    this.unsubscribeBackButton();
    return scanResult;
  }
}
