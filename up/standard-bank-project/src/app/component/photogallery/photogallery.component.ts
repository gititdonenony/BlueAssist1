import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Chooser, ChooserOptions } from '@awesome-cordova-plugins/chooser/ngx';

@Component({
  selector: 'app-photogallery',
  templateUrl: './photogallery.component.html',
  styleUrls: ['./photogallery.component.scss'],
})
export class PhotogalleryComponent implements OnInit {

  mediaObj
  constructor(
    private modalCtrl: ModalController,
    private chooser: Chooser,
  ) { }

  ngOnInit() { }


  gallery() {
    // { mimeTypes: 'image/*' }
    this.chooser.getFile()
      .then(file => {
        const img: any = file
        var type = img.mediaType
        var onlyType = type.slice(6, type.length)
        this.mediaObj = {
          imageFile: img.dataURI.split(',')[1],
          imageType: onlyType,
          mode:"gallery"
        };
        this.modalCtrl.dismiss(this.mediaObj);
      })
      .catch((error: any) => console.error(error));
  }


  async camera() {
    const image = await Camera.getPhoto({
      quality: 30,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      saveToGallery: false,
    });
    this.mediaObj = {
      imageFile: image.base64String.toString(),
      imageType: image.format,
      mode:"camera"
    };
    this.modalCtrl.dismiss(this.mediaObj)
  }
  close() {
    this.modalCtrl.dismiss(this.mediaObj)
  }
}
