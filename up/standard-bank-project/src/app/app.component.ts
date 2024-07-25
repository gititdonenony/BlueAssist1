/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable object-shorthand */
import { Subscription } from 'rxjs';
// app.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonToggle,
  LoadingController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { MenuController, NavController } from '@ionic/angular';
import { Shake } from '@ionic-native/shake/ngx';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { CallLoggedComponent } from './call-logged/call-logged.component';
import { PopoverController } from '@ionic/angular';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageService } from './services/message.service';
import { ShakealertComponent } from './component/shakealert/shakealert.component';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { ActionSheetController } from '@ionic/angular';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { EventService } from './services/event.service';
import { environment } from 'src/environments/environment';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { registerPlugin } from '@capacitor/core';
import { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation/definitions';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PackageoptionerrorpageComponent } from './packageoptionerrorpage/packageoptionerrorpage.component';
import { PackageSubComponent } from './components/package-sub/package-sub.component';
import { DependentuserComponent } from './dependentuser/dependentuser.component';
import { UpgradepackagesidebarComponent } from './upgradepackagesidebar/upgradepackagesidebar.component';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation'
);
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('toggle', { static: true }) toggleItem: IonToggle;
  currentPageTitle = 'Dashboard';
  appPages = [
    {
      title: 'My Details',
      url: '',
    },
    {
      title: 'My Vehicles',
      url: '/timeline',
    },
    {
      title: 'My Devices',
      url: '/settings',
    },
    {
      title: 'My Subscription',
      url: '/settings',
    },
  ];

  shakeSubscription: any;
  userObject: any;
  token: any;
  fullName: string;
  packageDetails: string;
  user_package: string;
  subscriptionType: any
  profileImage: string = "";
  profileImageName: string = "";
  showImage = false;
  profilePath: any;
  isPanicActivated = false;
  doesSupportShake = true;
  subcribeToPanic: Subscription;
  popover: any;
  panicAlertEnable: any;
  hideModel: boolean;
  deviceList: any[] = [];
  showNavHeader = false;
  isMenuOpen: any;

  loading: boolean = true;
  location: any;
  constructor(
    private plt: Platform,
    private menuctrl: MenuController,
    private navCtrl: NavController,
    private shake: Shake,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private messageService: MessageService,
    private alrt: AlertController,
    private vibration: Vibration,
    private actionSheetCtrl: ActionSheetController,
    private emailComposer: EmailComposer,
    private eventService: EventService,
    private backgroundMode: BackgroundMode,
    private route: Router,
    private locations: Location
  ) {
    SplashScreen.show();
    this.hideModel = false;
    this.backgroundMode.enable();
    this.backgroundMode.on('activate').subscribe(async () => {
      if (this.userObject) {
        this.backgroundShakeChanged();
      }
    });
    this.plt.ready().then((res) => {
      setTimeout(() => {
        SplashScreen.hide({
          fadeOutDuration: 1000
        });
      }, 3000)
    });

    route.events.subscribe((val) => {
      if (
        locations.path() === '/tabs/profile' ||
        locations.path() === '/tabs/search'
      ) {
        this.showNavHeader = true;
      } else {
        this.showNavHeader = false;
      }
    });

  }

  ngOnInit() {
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.navCtrl.navigateRoot('/tabs/profile');
      this.token = this.userObject.token;
    } else {
      this.navCtrl.navigateRoot('/login');
    }
    // console.log("ngOninit : " + this.userObject.token);

    this.userInfo(this.token);
    this.menuctrl.swipeGesture(false);
    this.eventService.get('isPanicActivated').subscribe((data: any) => {
      if (
        data.isHomepanicActivate === 0 ||
        data.isRoadpanicActivate === 0 ||
        data.isShakepanicActivate === 0
      ) {
        this.isPanicActivated = true;
      } else {
        this.isPanicActivated = false;
      }
    });
  }
  async createDatabase() { }
  signout() {
    this.profileImage = ''
    this.menuctrl.close();
    this.navCtrl.navigateRoot(['/login']);
    localStorage.clear();
    if (this.shakeSubscription) {
      this.shakeSubscription.unsubscribe();
    }
  }

  async mydeivce() {
    this.menuctrl.close();
    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;
    // const user_package = String("standard");
    console.log("user_package " + user_package);
    if (user_package === 'basic' || user_package === 'standard' || user_package === 'premium') {
      this.route.navigate(['/my-devices']);
    }
    else {
      console.log("can't access");
      // this.messageSerivce.presentErrorToastforPackage("sorry you dont have access  to this feature, please upgrade your subscription")
      const popover = await this.modalCtrl.create({
        component: PackageoptionerrorpageComponent,
        cssClass: 'login-unlock-modal-class',
      });
      return await popover.present();
    }
  }
  sideMenuClose() {
    this.menuctrl.close();
  }
  async toggleEnable() {


    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;
    // const user_package = String("standard");
    console.log("user_package " + user_package);
    if (user_package === 'basic' || user_package === 'standard' || user_package === 'premium') {
      if (this.toggleItem.checked === false) {
        this.panicAlertEnable = await this.modalCtrl.create({
          component: ShakealertComponent,
          componentProps: {
            togglestatus: this.toggleItem.checked,
          },
          cssClass: 'login-unlock-modal-class-e',
        });
        this.panicAlertEnable.onDidDismiss().then((data) => {
          this.toggleItem.checked = data.data;
        });
        return await this.panicAlertEnable.present();
      }
    }
    else {
      console.log("can't access");
      // this.messageSerivce.presentErrorToastforPackage("sorry you dont have access  to this feature, please upgrade your subscription")
      const popover = await this.modalCtrl.create({
        component: PackageoptionerrorpageComponent,
        cssClass: 'login-unlock-modal-class',
        
      });
      return await popover.present();
      
    }




  }
  async sub() {
    // const popover = await this.modalCtrl.create({
    //   component: PackageSubComponent,
    //   cssClass: 'login-unlock-modal-class-d',
    // });
    // return await popover.present(); 
    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;
    const user_depended = JSON.parse(localStorage.getItem('userInfo')).user_depended;
    console.log("user_package " + user_package);
    console.log("user depend " + user_depended);
    if ((user_package === 'basic' && user_depended === null) || (user_package === 'standard' && user_depended === null)) {
      const popover = await this.modalCtrl.create({
        component: PackageoptionerrorpageComponent,
        cssClass: 'login-unlock-modal-class-d',
      });
      return await popover.present();
    } else if ((
      user_package === 'basic' && user_depended !== null)
      || (user_package === 'standard' && user_depended !== null)
      || (user_package === 'premium' && user_depended !== null)
    ) {
      const popover = await this.modalCtrl.create({
        component: DependentuserComponent,
        cssClass: 'login-unlock-modal-class-d',
      });
      return await popover.present();
    } else if (user_package === 'premium' && user_depended === null) {
      const popover = await this.modalCtrl.create({
        component: UpgradepackagesidebarComponent,
        cssClass: 'login-unlock-modal-class-d',
      });
      return await popover.present();

    } else {
      console.log("something went wrong");
    }
  }
  //? on shake activate
  async shakeChanged(e) {

    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;
    // const user_package = String("standard");
    console.log("user_package " + user_package);
    if (user_package === 'basic' || user_package === 'standard' || user_package === 'premium') {
      if (e.detail.checked) {
        this.shakeSubscription = this.shake.startWatch(100).subscribe(
          (res) => {
            this.vibration.vibrate(1000);
            this.doesSupportShake = true;
            if (localStorage.getItem('isShakePanicAlertOn') === 'true') {
              this.messageService.presentToastWithDuration(
                'Panic Alert Already On Progress',
                1000
              );
            } else {
              localStorage.setItem('isShakePanicAlertOn', 'true');
              this.showPanicConfirmPopup();
              this.callPanicAlertRepetadely();
              this.modalCtrl.dismiss();
            }
          },
          (err) => {
            this.doesSupportShake = false;
            window.alert('Your device doesn"t support shake.');
          }
        );
      } else {
        if (this.shakeSubscription) {
          this.shakeSubscription.unsubscribe();
        }
      }
    }
    else {
      console.log("can't access");
      // this.messageSerivce.presentErrorToastforPackage("sorry you dont have access  to this feature, please upgrade your subscription")
      const popover = await this.modalCtrl.create({
        component: PackageoptionerrorpageComponent,
        cssClass: 'login-unlock-modal-class',
      });
      return await popover.present();
    }
  }

  //?  create panic alert
  async createPanicAlert(location?: any) {
    const body = {
      subPanicType: '',
      panicType: '',
    };
    return new Promise((resolve) => {
      if (location) {
        const response = this.apiService.postPanic(location, body);
        response.subscribe(
          async (res: any) => {
            this.eventService.publish('isPanicActivated', {
              isShakepanicActivate: res.status,
            });
            if (res.operation === 'success' && res.status) {
              this.stop();
            }
          },
          (err) => window.alert(err.data)
        );
      } else {
        this.apiService
          .printCurrentPosition()
          .then((cords) => {
            const response = this.apiService.postPanic(cords.coords, body);
            response.subscribe(
              async (res: any) => {
                this.eventService.publish('isPanicActivated', {
                  isShakepanicActivate: res.status,
                });
                if (res.operation === 'success' && res.status) {
                  this.stop();
                }
              },
              (err) => window.alert(err.data)
            );
          })
          .catch(async (err) => {
            window.alert('Please enable location and try again.');
          });
      }
    });
  }

  //? show popup
  async showPanicConfirmPopup() {
    this.popover = await this.modalCtrl.create({
      component: CallLoggedComponent,
      cssClass: 'login-unlock-modal-class',
    });
    await this.popover.present();
  }

  //? call panic alert every five min
  callPanicAlertRepetadely() {
    this.subcribeToPanic = timer(0, environment.panicApiCallTime)
      .pipe(switchMap(async () => this.createPanicAlert()))
      .subscribe((res) => console.log('res', res));
  }

  callPanicAlertRepetadelyInBg() {
    this.subcribeToPanic = timer(0, environment.panicApiCallTime)
      .pipe(switchMap(async () => this.createPanicAlert(this.location)))
      .subscribe((res) => console.log('res', res));
  }
  //close menu
  close_menu() {
    this.menuctrl.close();
  }
  //? disable the reapeating panic api call
  stop() {
    localStorage.setItem('isShakePanicAlertOn', 'false');
    this.subcribeToPanic.unsubscribe();
  }


  ionViewDidEnter() {
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    if (this.userObject) {
      this.token = this.userObject.token;
      this.userInfo(this.token);
    }
    // console.log("ngOninit : " + this.userObject.token);


  }
  //? Getting user info for sidebar
  userInfo(token) {
    console.log(token);
    this.apiService.userInfomation(token).subscribe((res: any) => {
      // console.log(JSON.parse(res));
      // var res: any = JSON.parse(res)
      localStorage.setItem('userInfo', JSON.stringify(res));
      // const res:any = JSON.stringify(ress)
      console.log("name :%%%%%%%%%%%%%%%%%%%%%%%%55  " + res.user_firstname);
      this.fullName = res.user_firstname;
      this.packageDetails = res.package
      this.user_package = res.user_package
      this.subscriptionType = res.user_package_type
      if (this.subscriptionType === null)
        this.subscriptionType = "N/A"
      this.profilePath = res.image_full_path;
      this.profileImageName = res.profile_image;
      console.log(this.profileImageName);
      if (this.profilePath === "" || this.profileImageName === "" || this.profileImageName === null) {
        // this.profileImage = this.profilePath + this.profileImageName;
        console.log("enter if block");

        this.showImage = false;
      }
      else {
        this.profileImage = this.profilePath + this.profileImageName;
        console.log("enter else block");
        this.showImage = true;
      }

      console.log("Show Image Value : " + this.showImage);

    });
  }

  sendEmail() {
    this.emailComposer
      .isAvailable()
      .then((available: boolean) => {
        if (available) {
          console.log('available');
          // this.emailComposer
          //   .getClients()
          //   .then((res) => window.alert(JSON.stringify(res)))
          //   .catch((er) => window.alert(JSON.stringify(er)));
          //Now we know we can send
          const email = {
            to: 'support@sb247assist.co.za',
            isHtml: true,
          };
          //this.emailComposer.addAlias('gmail', 'com.google.android.gm');
          // Send a text message using default options
          this.emailComposer.open(email);
        } else {
          window.alert('Email Composer is not available on this device');
        }
      })
      .catch((er) => console.log(er));
  }
  menuOpen() {
    this.isMenuOpen = true;
    this.userObject = JSON.parse(localStorage.getItem('userLoginData'));
    // console.log("menu open : " + this.userObject.token);

    this.userInfo(this.userObject.token);
  }
  menuClose() {
    this.isMenuOpen = false;
  }
  onLoad() {
    this.loading = false;
  }

  //? on shake activate
  backgroundShakeChanged() {
    this.shakeSubscription = this.shake.startWatch(100).subscribe(
      (res) => {
        this.guess_location(1000);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async guess_location(timeout) {
    BackgroundGeolocation.addWatcher(
      {
        requestPermissions: false,
        stale: true,
      },
      (location) => {
        this.location = location || undefined;
      }
    ).then((id) => {
      setTimeout(() => {
        this.callPanicAlertRepetadelyInBg();
        BackgroundGeolocation.removeWatcher({ id });
      }, timeout);
    });
  }
}
