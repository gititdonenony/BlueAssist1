import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController, MenuController, ModalController } from '@ionic/angular';
import { CallLoggedComponent } from './../../call-logged/call-logged.component';
import { StartYourAccidentReportComponent } from './../../start-your-accident-report/start-your-accident-report.component';
import { ClaimViewModel, SubmitEmail, claimModel } from './Model/claim.model';
import { ClaimService } from 'src/app/services/claim.service';
import { finalize } from "rxjs/operators";
import { Policy } from './Model/policy.model';
import { GlobalService } from 'src/app/services/global.service';
import { LocationService } from 'src/app/location-search/location-search.service';
import { Storage } from "@ionic/storage";
import { UserService } from 'src/app/services/user.service';
import {
  ToastController,
  AlertController,
} from "@ionic/angular";
import { MessageService } from 'src/app/services/message.service';
import { PackageoptionerrorpageComponent } from 'src/app/packageoptionerrorpage/packageoptionerrorpage.component';
import { ComingsoonComponent } from 'src/app/comingsoon/comingsoon.component';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  providers: [ClaimService, LocationService],

})
export class TabsPage implements OnInit {
  selectTab: any;
  _policies: Policy[];
  _policy: Policy;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild('tabs') tabs: IonTabs;
  userClaimSubmittedData: any = [];
  claimSeenArray: any = [];
  private _claimViewModel: ClaimViewModel[];
  _claimsDetail: claimModel;


  constructor(private route: Router, private modalCtrl: ModalController, private loadingctrl: LoadingController,
    private claimService: ClaimService,
    private global: GlobalService,
    private locationService: LocationService,
    private navCtrl: NavController,
    private alertctrl: AlertController,
    private storage: Storage,
    private userservice: UserService,
    private toastctrl: ToastController,
    private messageSerivce: MessageService

  ) { }

  ngOnInit() {

  }

  setCurrentTab(event) {
    this.selectTab = this.tabs.getSelected();
  }

  async lock(lockdeta) {
    const popover = await this.modalCtrl.create({
      component: CallLoggedComponent,
      cssClass: 'login-unlock-modal-class-d',
    });
    return await popover.present();
  }

  async presentAlertConfirm(data) {
    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;
    console.log("user_package " + user_package);
    if (user_package === 'basic' || user_package === 'standard' || user_package === 'premium' ) {
      var token = await this.storage.get("WbAuth");
      data = this.startclaim(0, "", token);
      console.log(data)

      if (data.claim_created_at) {
        const loading = await this.loadingctrl.create({
          message: "Please wait...",
        });
        await loading.present();
        const claim_date_time = data.claim_created_at.split(" ");
        this.getEmailStatus({
          claim_id: data.claim_id,
          claim_date: claim_date_time[0],
          claim_time: claim_date_time[1],
          userdata_email: data.userdata_email,
        });
        setTimeout(async () => {
          console.log(this.userClaimSubmittedData);
          if (
            this.userClaimSubmittedData &&
            this.userClaimSubmittedData.email_status == 1
          ) {
            return new Promise(async resolve => {
              var token = await this.storage.get("WbAuth");
              this.startclaim(data.userdata_id, "", data.claim_id);
              let response = this.claimService.getClaimByID(
                token,
                data.userdata_id
              );
              response
                .pipe(
                  finalize(async () => {
                    await loading.dismiss();
                  })
                )
                .subscribe((result: any) => {
                  if (result.operation == "success") {
                    this._claimViewModel = result.data
                      .userdata_id as ClaimViewModel[];
                  }
                }),
                err => {
                  console.log(err);
                };
            });
          } else {
            this.linkArNumberModal(data.claim_id);
            await loading.dismiss();
          }
        }, 1000);
      } else {
        const loading = await this.loadingctrl.create({
          message: "Please wait...",
        });
        await loading.present();

        return new Promise(async resolve => {
          var token = await this.storage.get("WbAuth");
          this.startclaim(0, "", token);
          const calim_ID = await this.storage.get("ClaimAuth")
          let response = this.claimService.getClaimByID(token, calim_ID);
          response
            .pipe(
              finalize(async () => {
                await loading.dismiss();
              })
            )
            .subscribe((result: any) => {
              if (result.operation == "success") {
                this._claimViewModel = result.data
                  .userdata_id as ClaimViewModel[];
              }
            }),
            err => {
              console.log(err);
            };
        });
      }
    }
    else {
      console.log("can't access");
      const popover = await this.modalCtrl.create({
        component: PackageoptionerrorpageComponent,
        cssClass: 'login-unlock-modal-class-d',
      });
      return await popover.present();
    }





  }



  async presentToast(a) {
    const toast = await this.toastctrl.create({
      message: a,
      duration: 3000,
      position: "top",
    });
    toast.present();
  }
  async tryInsurance(Id) {
    // const loading = await this.loadingctrl.create({
    //   message: " Insurance Notify....",
    // });
    // await loading.present();
    return new Promise(resolve => {
      this.storage.get("WbAuth").then(async token => {
        let address = "";
        let lat: Number = 0;
        let lng: Number = 0;
        try {
          console.log("run1");
          const location = await this.global.getLocation();
          lat = location.coords.latitude;
          lng = location.coords.longitude;
          address = await this.locationService.CurrentGeoCode(
            this.locationService.toILatLong(location)
          );
          //console.log("run2");
        } catch {
          address = "";
        }
        //console.log("run3");

        //console.log(Id);
        let body = {
          address: address,
          lat: lat.toString(),
          lng: lng.toString(),
        };

        //console.log(body);
        //console.log(Id);
        //console.log(token);
        let response = this.userservice.InsurenceNotify(Id, token, body);

        response
          .pipe(
            finalize(async () => {
              // await loading.dismiss();
            })
          )
          .subscribe((result: any) => {
            //console.log(result);
            if (result.operation == "success") {
              // loading.dismiss();
              this.presentToast("Your Insurer has been notified.");
              //console.log(result);
              const alert = this.alertctrl
                .create({
                  cssClass: "basic-alert",
                  // header: "Emergency",
                  backdropDismiss: false,
                  message: `<img src="assets/avtar-img/Path 4467@2x.png" class="card-alert"><p style="font-size:15px;">Thank you, we will be  touch with you shortly to assist you</p>`,

                  buttons: [
                    {
                      text: "Get started",
                      handler: () => {
                        this.startclaim(Id, body, "");
                        //console.log("Confirm Okay");
                      },
                    },
                  ],
                })
                .then(alertEt => {
                  alertEt.present();
                });
            } else if (result.operation == "error") {
              // loading.dismiss();
              const alert = this.alertctrl
                .create({
                  cssClass: "basic-alert",
                  // header: "Emergency",
                  backdropDismiss: false,
                  message: `<img src="assets/avtar-img/Path 4467@2x.png" class="card-alert"><p style="font-size:15px;">Thank you, we will be  touch with you shortly to assist you</p>`,

                  buttons: [
                    {
                      text: "Get started",
                      handler: () => {
                        this.startclaim(Id, body, "");
                        //console.log("Confirm Okay");
                      },
                    },
                  ],
                })
                .then(alertEt => {
                  alertEt.present();
                });

              console.log(result.message);
            }
          });
      }),
        err => {
          // loading.dismiss();
        };
    });
  }
  async startclaim(id, locationAddress, claim_id) {
    if (this.claimSeenArray.length > 0 && claim_id) {
      const hasSeen = this.claimSeenArray.filter(item => {
        //console.log(item, claim_id);
        return item == claim_id;
      });
      //console.log(hasSeen);
      if (hasSeen.length) {
        var loading = await this.loadingctrl.create({
          message: " Please wait....",
        });
        await loading.present();
        return new Promise(async resolve => {
          let address = "";
          let lat: Number = 0;
          let lng: number = 0;
          let body = new Object();
          if (locationAddress == "") {
            try {
              const location = await this.global.getLocation();

              lat = location.coords.latitude;
              lng = location.coords.longitude;

              address = await this.locationService.CurrentGeoCode(
                this.locationService.toILatLong(location)
              );
            } catch {
              address = "";
            }
            body = {
              address: address,
              lat: lat.toString(),
              lng: lng.toString(),
            };
          } else {
            body = locationAddress;
          }

          //console.log(body);
          this.storage.get("WbAuth").then(token => {
            //console.log(token);

            let response = this.claimService.StartClaim(id, body, token);
            response.subscribe((result: any) => {
              console.log(JSON.stringify(result));

              if (result.operation == "success") {
                //console.log(result.data);
                this._claimsDetail = result.data as claimModel;
                //this value used for shottime
                this.storage.remove("ClaimAuth");
                this.storage.set("ClaimAuth", this._claimsDetail.claim_id);
                loading.dismiss();
                this.navCtrl.navigateRoot([
                  "/home/accident",
                  { userid: this._claimsDetail.userdata_id },
                  // { userid: 2},
                ]);

              } else {
                loading.dismiss();
              }
              //console.log(result);
            });
          }),
            err => {
              loading.dismiss();
            };
        });
      } else {
        this.notifyInsurence(id, locationAddress);
      }
    } else {
      this.notifyInsurence(id, locationAddress);
    }
  }

  async notifyInsurence(id, locationAddress) {
    // var loading = await this.loadingctrl.create({
    //   message: " Insurance Notify....",
    // });
    // await loading.present();
    return new Promise(async resolve => {
      let address = "";
      let lat: Number = 0;
      let lng: number = 0;
      let body = new Object();
      if (locationAddress == "") {
        try {
          const location = await this.global.getLocation();

          lat = location.coords.latitude;
          lng = location.coords.longitude;

          address = await this.locationService.CurrentGeoCode(
            this.locationService.toILatLong(location)
          );
        } catch {
          address = "";
        }
        body = {
          address: address,
          lat: lat.toString(),
          lng: lng.toString(),
        };
      } else {
        body = locationAddress;
      }

      //console.log(body);
      this.storage.get("WbAuth").then(token => {
        //console.log(token);

        let response = this.claimService.StartClaim(id, body, token);
        response.subscribe((result: any) => {
          if (result.operation == "success") {
            //console.log(result.data);
            this._claimsDetail = result.data as claimModel;
            //this value used for shottime
            this.storage.remove("ClaimAuth");
            this.storage.set("ClaimAuth", this._claimsDetail.claim_id);
            // loading.dismiss();
            // src\app\pages\home\components\body\pages\accident
            this.navCtrl.navigateRoot([
              "/home/accident",
              { userid: this._claimsDetail.userdata_id },
              // { userid: 2},

            ]);
          } else {
            // loading.dismiss();
          }
          //console.log(result);
        });
      }),
        err => {
          // loading.dismiss();
        };
    });
  }
  async getEmailStatus(data: any) {
    const email: SubmitEmail = {
      claim_id: data.claim_id,
      accident_occurdate: data.claim_date,
      accident_occurtime: data.claim_time,
      email_sendto: data.userdata_email,
    };
    return new Promise(resolve => {
      this.storage.get("WbAuth").then(token => {
        let response = this.claimService.AddSubmitEmail(token, email);
        response.subscribe((res: any) => {
          //console.log(res);
          this.userClaimSubmittedData = res.data;
        }),
          err => {
            console.log("error=" + err);
          };
      });
    });
  }

  public async GetPolicies() {
    const loading = await this.loadingctrl.create({
      message: "Please wait...",
    });
    await loading.present();
    this.storage.get("WbAuth").then(token => {
      let response = this.userservice.GetUserAllPolicies(token);
      response
        .pipe(
          finalize(async () => {
            await loading.dismiss();
          })
        )
        .subscribe((result: any) => {
          console.log(result);
          if (result.operation == "success") {
            this._policies = result.data as Policy[];
            this._policies.map(e => {
              e.claimStatusArray = [];
            });
            this.getClaimHistory();
          }
        });
    }),
      err => {
        console.log("error1");
      };
  }
  public async getClaimHistory() {
    //console.error("I got called")
    return new Promise(resolve => {
      this.storage.get("WbAuth").then(token => {
        let response = this.claimService.getClaimHistory(token);
        response.subscribe((result: any) => {
          console.log(result, this._policies);
          if (result.operation == "success" && result.data.length) {
            if (this._policies.length) {
              this._policies.map(el => {
                result.data.map(e => {
                  if (e.userdata_id == el.userdata_id) {
                    el.claimStatusArray.push(e.claim_status);
                    el.claim_id = e.claim_id;
                    el.claim_created_at = e.claim_created_at;
                    //console.log(e);
                  }
                });
              });

              setTimeout(() => {
                this._policies.map(each => {
                  if (each.claimStatusArray.length > 1) {
                    let isClosed = each.claimStatusArray.every(e => e > 0);
                    //console.log(isClosed);
                    each.name = isClosed ? "Start New Claim" : "Complete Claim";
                  } else {
                    if (each.claimStatusArray[0] == 1) {
                      each.name = "Start New Claim";
                    } else if (each.claimStatusArray[0] == 0) {
                      each.name = "Complete Claim";
                    } else {
                      each.name = "Start New Claim";
                    }
                  }
                });
              }, 500);
            }
            //console.log(this._policies, result.data);
          } else {
            this._policies.map(el => {
              el.name = "Start New Claim";
            });
          }
        }),
          err => {
            console.log("error=" + err);
          };
      });
    });
  }

  async licencerenewalhome() {
    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;

    console.log("user_package " + user_package);
    if (user_package === 'basic' || user_package === 'standard' || user_package === 'premium') {
      this.route.navigate(['/licence-renewal-home']);
    }
    else {
      console.log("can't access");
      const popover = await this.modalCtrl.create({
        component: PackageoptionerrorpageComponent,
        cssClass: 'login-unlock-modal-class-d',
      });
      return await popover.present();
    }
  }
  async trafficFineshome() {
    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;

    console.log("user_package " + user_package);
    if (user_package === 'basic' || user_package === 'standard' || user_package === 'premium') {
      this.route.navigate(['/confirm-id']);
    }
    else {
      console.log("can't access");
      const popover = await this.modalCtrl.create({
        component: PackageoptionerrorpageComponent,
        cssClass: 'login-unlock-modal-class-d',
      });
      return await popover.present();
    }
  }
  async shophome() {
    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;

    console.log("user_package " + user_package);
    if (user_package === 'basic' || user_package === 'standard' || user_package === 'premium') {

      const popover = await this.modalCtrl.create({
        component: ComingsoonComponent,
        cssClass: 'login-unlock-modal-class-d',
      });
      return await popover.present();
    }
    else {
      console.log("can't access");
      const popover = await this.modalCtrl.create({
        component: PackageoptionerrorpageComponent,
        cssClass: 'login-unlock-modal-class-d',
      });
      return await popover.present();
    }
  }
  renaultjoureny() {
    this.route.navigate(['/pages/renault']);
  }
  linkArNumberModal(id: any) {
    this.route.navigateByUrl("/link-ar-number", {
      state: id,
    });
  }
}
