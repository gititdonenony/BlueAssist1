import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CameraCapturePageRoutingModule } from './camera-capture-routing.module';

import { Camera } from '@ionic-native/camera/ngx';

import { CameraCapturePage } from './camera-capture.page';

import { LottieAnimationViewModule } from 'ng-lottie';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CameraCapturePageRoutingModule,
    LottieAnimationViewModule
  ],
  providers: [
    Camera,
    CameraPreview
  ],
  declarations: [CameraCapturePage]
})
export class CameraCapturePageModule {}
