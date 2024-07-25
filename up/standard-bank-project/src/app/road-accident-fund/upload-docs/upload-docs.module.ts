import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadDocsPageRoutingModule } from './upload-docs-routing.module';

import { UploadDocsPage } from './upload-docs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadDocsPageRoutingModule
  ],
  declarations: [UploadDocsPage]
})
export class UploadDocsPageModule {}
