import { AccidentSceneService } from "./accident-scene.service";
import { PdfDownloaderService } from "src/app/services/pdf-downloader.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AccidentScenePageRoutingModule } from "./accident-scene-routing.module";

import { AccidentScenePage } from "./accident-scene.page";

import { ComponentsModule } from "src/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccidentScenePageRoutingModule,
    ComponentsModule,
  ],
  declarations: [AccidentScenePage],
})
export class AccidentScenePageModule {}
