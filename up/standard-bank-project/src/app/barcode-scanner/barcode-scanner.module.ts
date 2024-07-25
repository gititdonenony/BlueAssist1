import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarcodeScannerPageRoutingModule } from './barcode-scanner-routing.module';

import { BarcodeScannerPage } from './barcode-scanner.page';
// import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // QRCodeModule,
    BarcodeScannerPageRoutingModule
  ],
  declarations: [BarcodeScannerPage]
})
export class BarcodeScannerPageModule {}
