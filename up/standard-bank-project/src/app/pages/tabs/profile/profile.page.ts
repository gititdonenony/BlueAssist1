/* eslint-disable object-shorthand */
import { ElementRef, NgZone, ViewChild } from '@angular/core';
/* eslint-disable curly */
/* eslint-disable max-len */
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { HomeAssistComponent } from './../../../home-assist/home-assist.component';
import { RoadsideAssistComponent } from './../../../roadside-assist/roadside-assist.component';
import { PtoholeReportMainMenuComponent } from './../../../ptohole-report-main-menu/ptohole-report-main-menu.component';
import { CallLoggedComponent } from './../../../call-logged/call-logged.component';
import {
  NativeGeocoder,
  NativeGeocoderOptions,
  NativeGeocoderResult,
} from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@capacitor/geolocation';
//import { AppRate } from '@ionic-native/app-rate/ngx';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { EventService } from 'src/app/services/event.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { style } from '@angular/animations';
// import { map } from 'jquery';
// import { RSA_NO_PADDING } from 'constants';

import { IonRouterOutlet } from '@ionic/angular';
import { NavigationEnd } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { PackageoptionerrorpageComponent } from 'src/app/packageoptionerrorpage/packageoptionerrorpage.component';
import { StorageService } from 'src/app/services/storage.service';
import { DependentuserComponent } from 'src/app/dependentuser/dependentuser.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

enum responsezone {
  RESPONSEZONE = "YOU ARE IN A RAPID RESPONSE ZONE",
  NONRESPONSEZONE = "YOU ARE NOT IN A RAPID RESPONSE ZONE",
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  slideOpts = {};
  stories: any[] = [];
  buttonValue = 'grid';
  buttonItems: any[] = [];
  posts: any[] = [];
  userAddress: any;
  display: any;
  lat: number;
  lng: number;
  allKmljsonFiles = [
    { "name": '../../../assets/kml-json/CASICoverage2022-09-07.geojson' },
  ]
  currentKml: any
  kmlUrl1: any
  kmlUrl2: any
  kmlUrl3: any
  kmlUrl4: any
  responseCASI = []
  isKml1: boolean = false
  isKml2: boolean = false
  isKml3: boolean = false
  isKml4: boolean = false
  map: any;
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef | any;
  isAnyResponseArea: boolean = false
  responseText1 = ''
  responseText2 = ''

  markerStatus = ''

  featureCoordinates = []
  responseAirAmbulane = []
  responseSAPS = []
  responsePrivateMedical = []
  responseText = ''
  responseStatus: any
  scannedBarcode: string;
  center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12,
  };
  zoom = 5;

  coverageAreaPoint: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };

  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    icon: {
      url: '/assets/Subtract.png',
      scaledSize: new google.maps.Size(32, 34),
    },
  };
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    streetViewControl: false,
    zoomControl: true,
    mapTypeId: 'hybrid',
    mapTypeControl: true,
    controlSize: 25,
    mapTypeControlOptions: {
      mapTypeIds: ['hybrid', 'roadmap',],
      style: google.maps.MapTypeControlStyle.DEFAULT,
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER,
    },


    fullscreenControl: false,
    styles: [
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'poi',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'transit',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
    ],
  };
  isPanicActivated: any = false;
  markerPosition: google.maps.LatLngLiteral;

  address: any = {
    areasOfInterest: '',
    subLocality: '',
    locality: '',
    subAdministrativeArea: '',
    administrativeArea: '',
    postalCode: '',
    countryName: '',
    countryCode: '',
  };
  subcribeToPanic: Subscription;
  isLocationPermission = true;
  isWithinPolygon: any;

  constructor(
    private route: Router,
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private nativeGeocoder: NativeGeocoder,
    private platform: Platform,
    public ngZone: NgZone, //private appRate: AppRate
    private vibration: Vibration,
    private eventService: EventService,
    private menuctrl: MenuController,
    private routerOutlet: IonRouterOutlet,
    private router: Router,
    private messageSerivce: MessageService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private barcodeScanner: BarcodeScanner

  ) {
    console.log("called contructor");
    var version = google.maps.version;
    console.log("google map version : " + version);

    const markerUrl = `${JSON.parse(localStorage.getItem('userInfo')).image_full_path
      }${JSON.parse(localStorage.getItem('userInfo')).marker_img}`;
    this.kmlUrl1 = `${JSON.parse(localStorage.getItem('userInfo')).image_full_path}${JSON.parse(localStorage.getItem('userInfo')).AirAmbulanceSupport}`;
    this.kmlUrl2 = `${JSON.parse(localStorage.getItem('userInfo')).image_full_path}${JSON.parse(localStorage.getItem('userInfo')).CASICoverage}`;
    this.kmlUrl3 = `${JSON.parse(localStorage.getItem('userInfo')).image_full_path}${JSON.parse(localStorage.getItem('userInfo')).PrivateMedicalResponse}`;
    this.kmlUrl4 = `${JSON.parse(localStorage.getItem('userInfo')).image_full_path}${JSON.parse(localStorage.getItem('userInfo')).SAPSPublicAmbulance}`;


    const timestamp = new Date().getTime();
    this.markerOptions.icon = {
      url: `${JSON.parse(localStorage.getItem('userInfo')).image_full_path
        }${JSON.parse(localStorage.getItem('userInfo')).marker_img + "?" + timestamp}`,
      scaledSize: new google.maps.Size(53, 72),
    };
    this.initialize();

  }




  setMapMarker() {
    console.log("%%%%%%% setMap Marker method calledd %%%%");
    this.markerOptions = null
    this.markerOptions = {
      draggable: false,
      icon: {
        url: '/assets/Subtract.png',
        scaledSize: new google.maps.Size(32, 34),
      },
    };
    const timestamp = new Date().getTime();
    this.markerOptions.icon = {
      url: `${JSON.parse(localStorage.getItem('userInfo')).image_full_path
        }${JSON.parse(localStorage.getItem('userInfo')).marker_img}`,
      scaledSize: new google.maps.Size(53, 72),
    };
  }

  initialize() {
    console.log("call initialize method every time");

    //for manual checking
    // this.isAnyResponseArea = false
    // this.responseStatus = ''
    // this.checkAllKmlCoordinates(20.2986635, 85.860711)
    this.apiService
      .askToTurnOnGPS()
      .then((re) => {
        if (re) {
          this.watchPosition();
        } else {
          this.getDeviceLocation();
        }
      })
      .catch((err) => { });
  }
  sideMenuClose() {
    this.menuctrl.close();
  }



  handleChange(ev) {
    console.log("kml select option");

    this.currentKml = ev.target.value;
    console.log(this.currentKml);
    if (this.currentKml == "AirAmbulanceSupport") {
      this.isKml1 = true
      this.isKml2 = false
      this.isKml3 = false
      this.isKml4 = false
    }
    else if (this.currentKml == "CASICoverage") {
      this.isKml1 = false
      this.isKml2 = true
      this.isKml3 = false
      this.isKml4 = false
    }
    else if (this.currentKml == "PrivateMedical") {
      this.isKml1 = false
      this.isKml2 = false
      this.isKml3 = true
      this.isKml4 = false
    }
    else if (this.currentKml == "SAPSPublicAmbulance") {
      this.isKml1 = false
      this.isKml2 = false
      this.isKml3 = false
      this.isKml4 = true
    }
    else if (this.currentKml == "nothing") {
      this.isKml1 = false
      this.isKml2 = false
      this.isKml3 = false
      this.isKml4 = false
    }
    else {
      console.log("wrong value selected");
      this.isKml1 = false
      this.isKml2 = true
      this.isKml3 = false
      this.isKml4 = false
    }

  }

  // bindAllCordCASI(currentLat, currentLng) {
  //   this.isAnyResponseArea = false
  //   this.responseText1 = ''
  //   this.responseText2 = ''
  //   this.responseCASI = []
  //   console.log(this.responseCASI.length);

  //   console.log(this.allKmljsonFiles[0].name);
  //   fetch(this.allKmljsonFiles[0].name)
  //     .then(res => res.json())
  //     .then(data => {
  //       // console.log(data);
  //       data.features.forEach(geo => {
  //         geo.geometry.coordinates[0].forEach(cords => {
  //           this.responseCASI.push({ lat: cords[1], lng: cords[0] })
  //         });
  //       });
  //     })
  //   setTimeout(() => {
  //     // console.log(this.responseCASI.length)
  //     // var polyOptions = {
  //     //   paths: this.responseCASI,
  //     // };
  //     // var polygon = new google.maps.Polygon(polyOptions);
  //     // console.log(polygon);
  //     // console.log("currentLat-----> " + currentLat);
  //     // console.log("currentLng-----> " + currentLng);
  //     // console.log("type of currentLat-----> " + typeof currentLat);
  //     // console.log("type of currentLng-----> " + typeof currentLng);

  //     // this.coverageAreaPoint = { lat: currentLat, lng: currentLng };
  //     // var point = new google.maps.LatLng(this.coverageAreaPoint);
  //     // var point = new google.maps.LatLng(currentLat, currentLng);
  //     // var isWithinPolygon = google.maps.geometry.poly.containsLocation(point, polygon);
  //     // console.log(isWithinPolygon);

  //     this.isWithinRapidZone(-27.98406965916156, 30.727616010074005);

  //     // const isWithinPolygon = false
  //     const isWithinPolygon = this.isWithinPolygon;
  //     if (isWithinPolygon) {
  //       this.isAnyResponseArea = true
  //       this.responseText1 = responsezone.RESPONSEZONE
  //     }
  //     else {
  //       this.isAnyResponseArea = false
  //       this.responseText2 = responsezone.NONRESPONSEZONE
  //     }
  //   }, 2000);
  // }


  // async isWithinRapidZone(currentLat, currentLng) {


  bindAllCordCASI(currentLat, currentLng) {
    this.isAnyResponseArea = false
    this.responseText1 = ''
    this.responseText2 = ''
    this.responseCASI = []
    console.log(this.responseCASI.length);

    console.log(this.allKmljsonFiles[0].name);
    fetch(this.allKmljsonFiles[0].name)
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        data.features.forEach(geo => {
          geo.geometry.coordinates[0].forEach(cords => {
            this.responseCASI.push({ lat: cords[1], lng: cords[0] })
          });
        });
        // })
        // setTimeout(() => {
        // console.log(this.responseCASI.length)
        var polyOptions = {
          paths: this.responseCASI,
        };
        var polygon = new google.maps.Polygon(polyOptions);
        console.log('polygon==============>', polygon);
        // var Latitude = -27.98406965916156
        // var Longitude = 30.
        
        var Latitude = currentLat
        var Longitude = currentLng
        var point = new google.maps.LatLng(Latitude, Longitude);
        console.log('point==============>', point);
        var isWithinPolygon = google.maps.geometry.poly.containsLocation(point, polygon);
        console.log(isWithinPolygon);


        // const isWithinPolygon = false

        if (isWithinPolygon) {
          this.isAnyResponseArea = true
          this.responseText1 = responsezone.RESPONSEZONE
        }
        else {
          this.isAnyResponseArea = false
          this.responseText2 = responsezone.NONRESPONSEZONE
        }
        // }, 2000);
      })
  }



  // async isWithinRapidZone(currentLat, currentLng) {
  //   const body = {
  //     latitude: currentLat,
  //     longitude: currentLng,
  //   };


  //   await this.apiService.postLatLngForRapidZone(body).subscribe(
  //     (res: any) => {
  //       if (res.operation === 'success') {
  //             console.log('res.data------------->>>>', res.data);
  //             this.isWithinPolygon = res.data;
  //       }
  //     },
  //     (err) => {
  //       // this.messageService.presentErrorToast('Error for rapid Zone');
  //     }
  //   );

  // }



  getDeviceLocation() {
    console.log("enter getDeviceLocation");
    this.apiService
      .printCurrentPosition()
      .then((res) => {
        const location = res.coords;
        this.lat = location.latitude;
        this.lng = location.longitude;
        console.log("Get Device Location" + this.lat + " " + this.lng);

        console.log("In getDeviceLocation Method");
        console.log("Latitude - " + this.lat + "Longitude - " + this.lng);
        this.center = { lat: this.lat - 0.003, lng: this.lng };
        this.markerPosition = { lat: this.lat, lng: this.lng };
        this.zoom = 15;
        this.reverseGeocode(location.latitude, location.longitude);
        this.bindAllCordCASI(this.lat, this.lng);

      })
      .catch((err) => {
        if (this.isLocationPermission) {
          window.alert('app will not work proper if you denied for location');
          this.isLocationPermission = false;
        }
      });
  }
  async watchPosition() {
    // console.log("enter watchPosition");
    try {
      Geolocation.watchPosition({}, (position, err) => {
        this.ngZone.run(() => {
          if (err) {
            return;
          }
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          // console.log("In watchPosition Method");
          // console.log("Latitude - " + this.lat + "Longitude - " + this.lng);
          this.center = { lat: this.lat - 0.003, lng: this.lng };
          this.markerPosition = { lat: this.lat, lng: this.lng };
          this.zoom = 15;
          this.reverseGeocode(this.lat, this.lng);
          this.bindAllCordCASI(this.lat, this.lng);
        });
      });
    } catch (err) { }
  }


  ionViewDidEnter() {
    console.log("call ionViewDidEnter");
    this.markerStatus = this.activatedRoute.snapshot.paramMap.get('markerStatus');
    if (this.markerStatus === '1') {
      console.log("4th time call when marker status == 1 from persnal-page-two");
      this.markerOptions = null
      this.setMapMarker()
    }
    if (this.markerStatus === '2') {
      console.log("4th time call when marker status == 2 from finish home");
      this.markerOptions = null
      this.setMapMarker()
    }
    if (this.markerStatus === '3') {
      console.log("4th time call when marker status == 3 from login-success");
      this.markerOptions = null
      this.setMapMarker()
    }
    this.markerOptions = null
    this.setMapMarker()
    this.route.navigate(['/tabs/profile']);

  }


  openInfoWindow(marker: MapMarker) {
    console.log("enter info window");
    // console.log(`${JSON.parse(localStorage.getItem('userInfo')).image_full_path
    //   }${JSON.parse(localStorage.getItem('userInfo')).marker_img}`);
    // this.markerOptions.icon = {
    //   url: `${JSON.parse(localStorage.getItem('userInfo')).image_full_path
    //     }${JSON.parse(localStorage.getItem('userInfo')).marker_img}`,
    //   scaledSize: new google.maps.Size(53, 72),
    // };
    this.markerOptions = null
    this.setMapMarker()
    this.infoWindow.open(marker);
  }


  ionViewWillEnter() {
    console.log("enter every time");

  }

  ngOnInit() {


    this.stories = [
      { name: 'Pathole Assist', src: 'assets/icon/car.png' },
      { name: 'Home Assist', src: 'assets/icon/car.png' },
      { name: 'Roadside Assist', src: 'assets/icon/car.png' },
      { name: 'RAF Claim', src: 'assets/icon/car.png' },
    ];
    this.slideOpts = {
      slidesPerView: this.checkScreen(),
      slideShadows: true,
    };
    this.buttonItems = [
      { value: 'grid', icon: 'grid' },
      { value: 'reels', icon: 'film' },
      { value: 'photos', icon: 'images' },
    ];
    this.posts = [
      { id: 1, url: 'assets/imgs/posts/1.jpg' },
      { id: 2, url: 'assets/imgs/posts/2.jpg' },
      { id: 3, url: 'assets/imgs/posts/3.png' },
      { id: 4, url: 'assets/imgs/posts/4.png' },
      { id: 9, url: 'assets/imgs/posts/5.jpg' },
      { id: 6, url: 'assets/imgs/posts/6.png' },
      { id: 5, url: 'assets/imgs/posts/7.png' },
      { id: 8, url: 'assets/imgs/posts/8.jpg' },
      { id: 7, url: 'assets/imgs/posts/9.png' },
      { id: 10, url: 'assets/imgs/posts/10.png' },
      { id: 11, url: 'assets/imgs/posts/11.png' },
      { id: 12, url: 'assets/imgs/posts/12.png' },
    ];

    this.eventService.get('isPanicActivated').subscribe((data: any) => {
      if (
        data.isHomepanicActivate === 0 ||
        data.isRoadpanicActivate === 0 ||
        data.isShakepanicActivate === 0 ||
        localStorage.getItem('isShakePanicAlertOn') === 'true' ||
        localStorage.getItem('isHomePanicAlertOn') === 'true' ||
        localStorage.getItem('isRoadPanicAlertOn') === 'true' ||
        localStorage.getItem('isFabPanicAlertOn') === 'true'
      ) {
        this.isPanicActivated = true;
      } else {
        this.isPanicActivated = false;
      }
    });
  }

  async lock(lockdeta) {
    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;
    const user_depended = JSON.parse(localStorage.getItem('userInfo')).user_depended;
    // const user_depended = 256; //for dependent user value come like this 256 is a parent user_id
    console.log("user_package " + user_package);
    console.log("user depend " + user_depended);
    if ((user_package === 'premium' && user_depended === null) || (user_package === 'premium' && user_depended! !== null)) {
      const popover = await this.modalCtrl.create({
        component: HomeAssistComponent,
        cssClass: 'login-unlock-modal-class-d',
        componentProps: { panicStatus: this.isPanicActivated },
      });
      return await popover.present();
    }
    else {
      if ((user_package === 'basic' && user_depended === null) || (user_package === 'standard' && user_depended === null)) {
        const popover = await this.modalCtrl.create({
          component: PackageoptionerrorpageComponent,
          cssClass: 'login-unlock-modal-class-d',
        });
        return await popover.present();
      }
      else if ((user_package === 'basic' && user_depended !== null) || (user_package === 'standard' && user_depended !== null)) {
        const popover = await this.modalCtrl.create({
          component: DependentuserComponent,
          cssClass: 'login-unlock-modal-class-d',
        });
        return await popover.present();
      }
      else {
        alert("something went wrong")
      }
    }
  }

  async roadside(lockdeta) {
    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;
    const user_depended = JSON.parse(localStorage.getItem('userInfo')).user_depended;
    // const user_depended = 256; //for dependent user value come like this 256 is a parent user_id
    console.log("user_package " + user_package);
    console.log("user depend " + user_depended);
    if ((user_package === 'premium' && user_depended === null) || (user_package === 'premium' && user_depended! !== null)) {
      const popover = await this.modalCtrl.create({
        component: RoadsideAssistComponent,
        cssClass: 'login-unlock-modal-class-d',
        componentProps: { panicStatus: this.isPanicActivated },
      });
      return await popover.present();
    }
    else {
      if ((user_package === 'basic' && user_depended === null) || (user_package === 'standard' && user_depended === null)) {
        const popover = await this.modalCtrl.create({
          component: PackageoptionerrorpageComponent,
          cssClass: 'login-unlock-modal-class-d',
        });
        return await popover.present();
      }
      else if ((user_package === 'basic' && user_depended !== null) || (user_package === 'standard' && user_depended !== null)) {
        const popover = await this.modalCtrl.create({
          component: DependentuserComponent,
          cssClass: 'login-unlock-modal-class-d',
        });
        return await popover.present();
      }
      else {
        alert("something went wrong")
      }
    }
  }

  async lockshop() {
    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;
    const user_depended = JSON.parse(localStorage.getItem('userInfo')).user_depended;
    // const user_depended = 256; //for dependent user value come like this 256 is a parent user_id
    console.log("user_package " + user_package);
    console.log("user depend " + user_depended);

    if ((user_package === 'premium' && user_depended === null) || (user_package === 'premium' && user_depended! !== null) ||
      (user_package === 'standard' && user_depended === null) || (user_package === 'standard' && user_depended! !== null)
    ) {
      this.route.navigate(['/pothole']);
    }
    else {
      if (user_package === 'basic' && user_depended === null) {
        const popover = await this.modalCtrl.create({
          component: PackageoptionerrorpageComponent,
          cssClass: 'login-unlock-modal-class-d',
        });
        return await popover.present();
      }
      else if (user_package === 'basic' && user_depended !== null) {
        const popover = await this.modalCtrl.create({
          component: DependentuserComponent,
          cssClass: 'login-unlock-modal-class-d',
        });
        return await popover.present();
      }
      else {
        alert("something went wrong")
      }
    }
  }


  async rafRoute() {
    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;
    const user_depended = JSON.parse(localStorage.getItem('userInfo')).user_depended;
    // const user_depended = 256; //for dependent user value come like this 256 is a parent user_id
    console.log("user_package " + user_package);
    console.log("user depend " + user_depended);

    if ((user_package === 'premium' && user_depended === null) || (user_package === 'premium' && user_depended! !== null) ||
      (user_package === 'standard' && user_depended === null) || (user_package === 'standard' && user_depended! !== null)
    ) {
      this.route.navigate(['/roadcove']);
    }
    else {
      if (user_package === 'basic' && user_depended === null) {
        const popover = await this.modalCtrl.create({
          component: PackageoptionerrorpageComponent,
          cssClass: 'login-unlock-modal-class-d',
        });
        return await popover.present();
      }
      else if (user_package === 'basic' && user_depended !== null) {
        const popover = await this.modalCtrl.create({
          component: DependentuserComponent,
          cssClass: 'login-unlock-modal-class-d',
        });
        return await popover.present();
      }
      else {
        alert("something went wrong")
      }
    }
  }




  async lockCall() {
    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;
    console.log("user_package " + user_package);
    if (user_package === 'basic' || user_package === 'standard' || user_package === 'premium') {
      if (!this.isPanicActivated) {
        this.isPanicActivated = true;
        localStorage.setItem('isFabPanicAlertOn', 'true');
        this.showPanicConfirmPopup();
        this.callPanicAlertRepetadely();
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

  checkScreen() {
    const innerWidth = window.innerWidth;
    switch (true) {
      case 340 > innerWidth:
        return this.checkLength(5.5);
      case 340 <= innerWidth && innerWidth <= 400:
        return this.checkLength(5.5);
      case 401 <= innerWidth && innerWidth <= 700:
        return this.checkLength(6.5);
      case 701 <= innerWidth && innerWidth <= 900:
        return this.checkLength(7.5);
      case 901 <= innerWidth:
        return this.checkLength(9.5);
    }
  }

  checkLength(val) {
    const length = this.stories.length;
    return val < length ? val : length;
  }

  buttonsChanged(event) {
    this.buttonValue = event.detail.value;
  }

  //? get user address
  reverseGeocode(lat, lng) {
    if (this.platform.is('cordova')) {
      const options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5,
      };
      this.nativeGeocoder
        .reverseGeocode(lat, lng, options)
        .then((result: NativeGeocoderResult[]) => {
          this.userAddress = `${result[0].areasOfInterest} ${result[0].subLocality} ${result[0].locality},${result[0].subAdministrativeArea},${result[0].administrativeArea},${result[0].countryName}`;
        })
        .catch((error: any) => console.log(error));
    } else {
    }
  }

  //?  create panic alert
  async createPanicAlert() {
    const body = {
      subPanicType: '',
      panicType: '',
    };
    return new Promise((resolve) => {
      this.apiService
        .printCurrentPosition()
        .then((cords) => {
          const response = this.apiService.postPanic(cords.coords, body);
          response.subscribe(
            async (res: any) => {
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
    });
  }

  //? show popup
  async showPanicConfirmPopup() {
    this.vibration.vibrate(1000);
    const popover = await this.modalCtrl.create({
      component: CallLoggedComponent,
      cssClass: 'login-unlock-modal-class-d',
    });
    await popover.present();
  }

  //? call panic alert every five min
  callPanicAlertRepetadely() {
    this.subcribeToPanic = timer(0, environment.panicApiCallTime)
      .pipe(switchMap(async () => this.createPanicAlert()))
      .subscribe((res) => console.log('res', res));
  }

  //? disable the reapeating panic api call
  stop() {
    localStorage.setItem('isFabPanicAlertOn', 'false');
    this.isPanicActivated = false;
    this.subcribeToPanic.unsubscribe();
  }


  async scanBarcode() {
    const user_package = `${JSON.parse(localStorage.getItem('userInfo')).user_package}`;
    const user_depended = JSON.parse(localStorage.getItem('userInfo')).user_depended;
    // const user_depended = 256; //for dependent user value come like this 256 is a parent user_id
    console.log("user_package " + user_package);
    console.log("user depend " + user_depended);

    if ((user_package === 'premium' && user_depended === null) || (user_package === 'premium' && user_depended! !== null) ||
      (user_package === 'standard' && user_depended === null) || (user_package === 'standard' && user_depended! !== null)
    ) {
      this.route.navigate(['/barcode-scanner']);
    }
    else {
      if (user_package === 'basic' && user_depended === null) {
        const popover = await this.modalCtrl.create({
          component: PackageoptionerrorpageComponent,
          cssClass: 'login-unlock-modal-class-d',
        });
        return await popover.present();
      }
      else if (user_package === 'basic' && user_depended !== null) {
        const popover = await this.modalCtrl.create({
          component: DependentuserComponent,
          cssClass: 'login-unlock-modal-class-d',
        });
        return await popover.present();
      }
      else {
        alert("something went wrong")
      }
    }
  }
}
