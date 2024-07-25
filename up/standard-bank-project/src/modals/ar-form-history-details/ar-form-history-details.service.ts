import { Injectable, EventEmitter } from "@angular/core";
import { ModalController } from "@ionic/angular";

import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";

import {
  StorageService,
  Prefixes,
  Tables,
} from "../../services/storage.service";
import { HttpService } from "../../services/http.service";
import {
  IArFormHistoryDetails,
  IArFormHistory,
  IUserModel,
} from "../../services/models.service";
import { GlobalService } from "../../services/global.service";
import { LoggerService } from "../../services/logger.service";

import { Observable } from "rxjs";

import * as JSZip from "jszip";
import { LoadingController } from "@ionic/angular";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";

@Injectable()
export class ArFormHistoryDetailsService {
  formDetails: IArFormHistoryDetails;
  accidentDetails: IArFormHistory;

  private userDetails: IUserModel;
  private activeFileTransfer: FileTransferObject;
  private formDownloadProgressChange: EventEmitter<number> = new EventEmitter();

  constructor(
    private http: HttpService,
    private modalController: ModalController,
    private storage: StorageService,
    private fileTransfer: FileTransfer,
    private file: File,
    private global: GlobalService,
    private fileOpener: FileOpener,
    private logger: LoggerService,
    public loadingController: LoadingController,
    private androidPermissions: AndroidPermissions
  ) {}

  async initialize(accidentDetails: IArFormHistory) {
    try {
      this.accidentDetails = accidentDetails;
      const formDetails = await this.storage.get(
        `${Prefixes.ArFormHistoryDetail}${accidentDetails.FormId}`
      );
      this.formDetails = formDetails;
      this.userDetails = await this.storage.get(Tables.UserDetails);
    } catch (err) {
      this.logger.error("ArFormHistoryDetailsService::initialize", err);
    }
  }

  cleanUp() {
    if (this.activeFileTransfer) {
      this.activeFileTransfer.abort();
    }
  }

  async close() {
    await this.modalController.dismiss();
  }

  subscribeToFormDownloadProgress(): Observable<number> {
    return this.formDownloadProgressChange.asObservable();
  }

  async downloadArForm() {
    try {
      if (
        !this.formDetails ||
        (this.formDetails && !this.formDetails.ArFormFileUri)
      ) {
        const didSetFormDetails = await this.retrieveFormDetails();
        if (!didSetFormDetails) {
          await this.global.toast(
            "Something went wrong while trying to fetch your AR Form. Please try again in a few minutes."
          );
          return;
        }

        const downloadAndSaveResult = await this.downloadAndSaveArForm();
        if (!downloadAndSaveResult) {
          await this.global.toast(
            "Something went wrong while trying to fetch your AR Form. Please try again in a few minutes."
          );
          return;
        }
      }

      await this.fileOpener.open(
        `${this.formDetails.ArFormDirectoryUri}${this.formDetails.ArFormFileUri}`,
        "application/pdf"
      );
    } catch (err) {
      this.logger.error("ArFormHistoryDetailsService::downloadArForm", err);
    }
  }

  async resendForm(): Promise<any> {
    return new Promise(resolve => {
      this.http
        .post("/forms/v1/resend", {
          FormId: this.formDetails.FormId,
          UserId: this.userDetails.Id,
          UserName: this.userDetails.Name,
          UserEmail: this.userDetails.Email,
        })
        .then(async (data: any) => {
          if (!data || !data.Success) {
            console.log(data);
            await this.global.toast(
              "Something went wrong while trying to resend your AR Form. Please try again in a few minutes."
            );
          } else {
            await this.global.toast(
              "Email was resent. Please check your inbox."
            );
          }
        })
        .catch(async err => {
          this.logger.error("ArFormHistoryDetailsService::resendForm", err);
          await this.global.toast(
            "Something went wrong while trying to resend your AR Form. Please try again in a few minutes."
          );
        })
        .finally(() => {
          resolve(true);
        });
    });
  }

  private async retrieveFormDetails(): Promise<boolean> {
    return new Promise(resolve => {
      this.http
        .get(`/forms/v1/arform/${this.accidentDetails.FormId}`)
        .then(async (details: IArFormHistoryDetails) => {
          this.formDetails = details;
          await this.storage.set(
            `${Prefixes.ArFormHistoryDetail}${this.accidentDetails.FormId}`,
            this.formDetails
          );
          resolve(true);
        })
        .catch(err => {
          this.logger.error(
            "ArFormHistoryDetailsService::retrieveFormDetails",
            err
          );
          resolve(false);
        });
    });
  }

  private async downloadAndSaveArForm(): Promise<boolean> {
    return new Promise(async resolve => {
      this.activeFileTransfer = this.fileTransfer.create();
      this.activeFileTransfer.onProgress((progress: ProgressEvent) => {
        const percentage = (progress.loaded / progress.total) * 100;
        this.formDownloadProgressChange.emit(percentage);
      });

      await this.checkFormDirectory();
      const formName = this.cleanFormName(
        `${this.accidentDetails.AccidentDate}_${this.accidentDetails.AccidentType}`
      );
      this.activeFileTransfer
        .download(
          this.formDetails.ArFormDownloadLink,
          `${this.file.dataDirectory}/${this.formDetails.FormId}/${formName}.zip`,
          true
        )
        .then(
          async entry => {
            console.log("download complete: " + entry.toURL());
            await this.extractArFormZip(formName);
            resolve(true);
          },
          error => {
            this.logger.error(
              "ArFormHistoryDetailsService::downloadAndSaveArForm::download",
              error
            );
            resolve(false);
          }
        )
        .finally(() => {
          this.activeFileTransfer = null;
        });
    });
  }

  private async checkFormDirectory() {
    let dirDoesExist = false;
    try {
      dirDoesExist = await this.file.checkDir(
        this.file.dataDirectory,
        this.formDetails.FormId
      );
    } catch (err) {
      console.log(err);
    }

    if (!dirDoesExist) {
      try {
        await this.file.createDir(
          this.file.dataDirectory,
          this.formDetails.FormId,
          false
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  private cleanFormName(rawFormName: string): string {
    while (rawFormName.indexOf(" ") > -1) {
      rawFormName = rawFormName.replace(" ", "_");
    }
    while (rawFormName.indexOf("/") > -1) {
      rawFormName = rawFormName.replace("/", "-");
    }
    return rawFormName;
  }

  private async extractArFormZip(fileName: string) {
    try {
      this.formDownloadProgressChange.emit(0);
      const arrayBuffer = await this.file.readAsArrayBuffer(
        `${this.file.dataDirectory}${this.formDetails.FormId}/`,
        `${fileName}.zip`
      );
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(arrayBuffer, {
        createFolders: true,
      });

      const arFormArrayBuffer: ArrayBuffer = await loadedZip
        .file("Accident Report Form.pdf")
        .async("arraybuffer");
      const newFileResult = await this.file.writeFile(
        `${this.file.dataDirectory}${this.formDetails.FormId}/`,
        `${fileName}.pdf`,
        arFormArrayBuffer,
        { replace: true }
      );

      await this.file.removeFile(
        `${this.file.dataDirectory}${this.formDetails.FormId}/`,
        `${fileName}.zip`
      );

      this.formDetails.ArFormDirectoryUri = `${this.file.dataDirectory}${this.formDetails.FormId}/`;
      this.formDetails.ArFormFileUri = `${fileName}.pdf`;

      await this.storage.set(
        `${Prefixes.ArFormHistoryDetail}${this.formDetails.FormId}`,
        this.formDetails
      );
    } catch (err) {
      this.logger.error("ArFormHistoryDetailsService::extractArFormZip", err);
    }
  }

  //! by ari
  async downloadPdfByIrl(url: string, id: number) {
    const result = this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      )
      .then(
        async result => {
          console.log("Has permission?", result.hasPermission);
          if (!result.hasPermission) {
            return this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
            );
          } else {
            const loading = await this.loadingController.create({
              message: "Please wait...",
            });
            await loading.present();

            const fileTransfer: FileTransferObject = this.fileTransfer.create();
            fileTransfer
              .download(
                url,
                this.file.externalRootDirectory +
                  "/Download/" +
                  `claim-${id}.pdf`
              )
              .then(
                entry => {
                  console.log("download complete: " + entry.toURL());
                  this.fileOpener
                    .open(entry.toURL(), "application/pdf")
                    .then(async () => {
                      await loading.dismiss();
                      console.log("File is opened");
                    })
                    .catch(async e => {
                      await loading.dismiss();
                      console.log("Error opening file", e);
                    });
                },
                error => {
                  // handle error
                }
              );
          }
        },
        err => {
          return this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
          );
        }
      );
  }
}
