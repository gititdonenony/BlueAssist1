import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx'
import { HomeAssistComponent } from './home-assist/home-assist.component';
import { RoadsideAssistComponent } from './roadside-assist/roadside-assist.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ClaimService } from './services/claim.service';
import { GlobalService } from './services/global.service';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Shake } from '@ionic-native/shake/ngx';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './component/header/header.component';
import { EventService } from './services/event.service';
import { AccidentSceneService } from "src/app/pages/accident-reporting/snap/accident-scene/accident-scene.service";
import { MessageBusService } from './services/messagebus.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx'
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerService } from './services/logger.service';
import { FirebaseCrashlytics } from "@ionic-native/firebase-crashlytics/ngx";
import { FirebaseAnalytics } from "@ionic-native/firebase-analytics/ngx";
import { File } from "@ionic-native/file/ngx"
import { AppVersion } from "@ionic-native/app-version/ngx";
// import { Geolocation } from "@ionic-native/geolocation";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { StorageService } from './services/storage.service';
import { Storage } from "@ionic/storage";
import { Network } from '@ionic-native/network/ngx';
import { Device } from "@ionic-native/device/ngx";
import { HttpService } from "src/app/services/http.service";
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx'
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { UserService } from './services/user.service';
import { ClaimsClickService } from "src/app/services/claims-click.service";
import { LocationService } from './location-search/location-search.service';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx"
import { from } from 'rxjs';
import { IconService } from "src/app/services/icon.service";
import { FormBuilderService } from "src/app/services/formbuilder.service";
import { PageBuilderService } from "src/app/services/pagebuilder.service";
import { ScannerService } from "src/app/services/scanner.service";
import { ArFormSubmitterPage } from "../modals/ar-form-submitter/ar-form-submitter.page";
import { ArFormSubmitterPageModule } from '../modals/ar-form-submitter/ar-form-submitter.module';
import { GenericPopupPageModule } from "../modals/generic-popup/generic-popup.module";
import { GenericPopupPage } from "../modals/generic-popup/generic-popup.page";
import { SelectOthersInvolvedPageModule } from "../modals/select-others-involved/select-others-involved.module";
import { SelectOthersInvolvedPage } from "../modals/select-others-involved/select-others-involved.page";
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ProfilePage } from './pages/tabs/profile/profile.page';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { PhotogalleryComponent } from './component/photogallery/photogallery.component';


@NgModule({
  declarations: [AppComponent, RoadsideAssistComponent, HomeAssistComponent,PhotogalleryComponent],
  entryComponents: [
    ArFormSubmitterPage,
    GenericPopupPage,
    SelectOthersInvolvedPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ArFormSubmitterPageModule,
    GenericPopupPageModule,
    SelectOthersInvolvedPageModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Shake,
    Storage,
    Network,
    InAppBrowser,
    Camera,
    BarcodeScanner,
    Device,
    FormBuilderService,
    WebView,
    HttpService,
    CameraPreview,
    NativeGeocoder,
    Vibration,
    IconService,
    EmailComposer,
    EventService,
    PageBuilderService,
    ClaimService,
    GlobalService,
    AccidentSceneService,
    StorageService,
    ClaimsClickService,
    MessageBusService,
    UserService,
    LocationService,
    ScannerService,
    LoggerService,
    BackgroundMode,
    FirebaseCrashlytics,
    FirebaseAnalytics,
    File,
    AppVersion,
    Geolocation,
    ProfilePage,
    Chooser,

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
