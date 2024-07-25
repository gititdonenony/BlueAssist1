import { DangerousGoodsService } from './../accident-reporting/submit/dangerous-goods/dangerous-goods.service';
import { SpecialObservationsService } from './../accident-reporting/submit/special-observations/special-observations.service';
import { PassengerInfoService } from './../accident-reporting/scan/passenger-info/passenger-info.service';
import { YourVehicleDamagesService } from './../accident-reporting/snap/your-vehicle-damages/your-vehicle-damages.service';
import { AccidentSceneService } from './../accident-reporting/snap/accident-scene/accident-scene.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';

import { LocationSearchComponent } from './components/location-search/location-search.component';
import { EmergencyFooterComponent } from './components/emergency-footer/emergency-footer.component';
import { BodyComponent } from './components/body/body.component';

// =============== Body Routing Components =============== //
import { StartComponent } from './components/body/pages/start/start.component';
import { AccidentComponent } from './components/body/pages/accident/accident.component';
import { SnapComponent } from './components/body/pages/snap/snap.component';
import { SubmitComponent } from './components/body/pages/submit/submit.component';
// ======================================================= //

import { HomePageRoutingModule } from './home-routing.module';
import { ComponentsModule } from 'src/components/components.module';

import { CallNumber } from '@ionic-native/call-number/ngx';
// import { AcceptPageModule } from 'src/app/accept/accept.module';
import { OtherVehicleDamagesService } from '../accident-reporting/snap/other-vehicle-damages/other-vehicle-damages.service';
import { RoadConditionsService } from '../accident-reporting/snap/road-conditions/road-conditions.service';
import { PersonalInfoService } from '../accident-reporting/scan/shared-services/personal-info.service';
import { OtherVehicleInfoService } from '../accident-reporting/scan/other-vehicle-info/other-vehicle-info.service';
import { YourVehicleInfoService } from '../accident-reporting/scan/your-vehicle-info/your-vehicle-info.service';
import { WitnessInfoService } from '../accident-reporting/scan/witness-info/witness-info.service';
import { SubmitAndEmailService } from '../accident-reporting/submit/submit-and-email/submit-and-email.service';


import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';
import { ScanComponent } from './components/body/pages/scan/scan.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule,
    // AcceptPageModule,
  ],
  declarations: [
    HomePage,
    EmergencyFooterComponent,
    BodyComponent,
    
    // =============== Body Routing Components =============== //
    StartComponent,
    AccidentComponent,
    SnapComponent,
    ScanComponent,
    SubmitComponent
    // ======================================================= //
  ],
  providers: [
    CallNumber,
    AccidentSceneService,
    YourVehicleDamagesService,
    OtherVehicleDamagesService,
    RoadConditionsService,
    PersonalInfoService,
    OtherVehicleInfoService,
    YourVehicleInfoService,
    WitnessInfoService,
    PassengerInfoService,
    SpecialObservationsService,
    DangerousGoodsService,
    SubmitAndEmailService,
    FirebaseMessaging
  ],
  entryComponents: [
    LocationSearchComponent,
    EmergencyFooterComponent,
    BodyComponent
  ]
})
export class HomePageModule {}
