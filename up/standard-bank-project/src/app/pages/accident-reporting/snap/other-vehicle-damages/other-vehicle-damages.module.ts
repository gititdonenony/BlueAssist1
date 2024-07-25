import { ClaimsClickService } from "./../../../../services/claims-click.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OtherVehicleDamagesPageRoutingModule } from "./other-vehicle-damages-routing.module";

import { OtherVehicleDamagesPage } from "./other-vehicle-damages.page";

import { ComponentsModule } from "src/app/component/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtherVehicleDamagesPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [OtherVehicleDamagesPage],
  providers: [ClaimsClickService],
})
export class OtherVehicleDamagesPageModule {}
