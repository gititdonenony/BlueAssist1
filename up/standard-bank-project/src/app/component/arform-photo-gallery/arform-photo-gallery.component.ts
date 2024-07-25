import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { CameraCapacitorService } from 'src/app/services/camera-capacitor.service';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';

@Component({
  selector: 'app-arform-photo-gallery',
  templateUrl: './arform-photo-gallery.component.html',
  styleUrls: ['./arform-photo-gallery.component.scss'],
})
export class ARformPhotoGalleryComponent implements OnInit {
  mediaObj
  constructor(
    private modalCtrl: ModalController,
    private cameraCapacitorService: CameraCapacitorService,
    private chooser: Chooser,
  ) { }

  ngOnInit() { }


 async gallery() {

    this.chooser.getFile()
    .then(file => {

     console.log('file==============>>>',file);
     const img: any = file;
     const customObject = {
      Base64: img.dataURI,
      Directory: null,
      FileName: img.name,
      FullPath: null,
      ImageSource: 'gallery',
      ThumbnailDirectory: null,
      imageType: img.mediaType.split('/')[1].toLowerCase(),
      data: img.data,
      mode:"gallery"
    };
    
    console.log('customObject:+++++++++++++++++++++ ', customObject);
    
    this.modalCtrl.dismiss(customObject);
  })
  .catch((error: any) =>{
     console.error(error)
     return null;
    });


  }


  async camera() {

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        // source: CameraSource.Prompt,
        source: CameraSource.Camera,
        saveToGallery: false,
      });
  
      console.log('Camera Image:', image);
      const base64String = await this.convertToBase64(image.webPath);
  
      const output = {
        Base64: `data:image/${image.format};base64,${base64String}`,
        Directory: null,
        FileName: image.webPath.split('/').pop(),
        FullPath: `null${image.webPath}`,
        ImageSource: 'Camera',
        ThumbnailDirectory: `nullthumbnails/${image.webPath.split('/').pop()}`,
        mode:"camera"
      };
  
      console.log('Formatted Output:===========>>>><<<<', output);
      console.log('Formatted Output:', JSON.stringify(output));
  
      this.modalCtrl.dismiss(output)
  
    } catch (error) {
      console.error('Error capturing image:', error);
    }

  }

  async convertToBase64(filePath: string): Promise<string> {
    // Load the image as a Blob
    const response = await fetch(filePath);
    const blob = await response.blob();
  
    // Convert Blob to Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (reader.result) {
          const base64String = reader.result.toString().split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert image to Base64.'));
        }
      };
      reader.readAsDataURL(blob);
    });
  }


  close() {
    this.modalCtrl.dismiss(null)
  }
}
