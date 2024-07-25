import { Injectable } from '@angular/core';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Injectable({
  providedIn: 'root'
})
export class CameraCapacitorService {
 public mediaObj: any;
 public customObject: any;

  constructor(
    private chooser: Chooser,
  ) { }

async cameraCapture() {
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

    return output;

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





// async takeFromGallery(){

//    this.chooser.getFile()
//       .then(file => {

//        console.log('file==============>>>',file);

//         const img: any = file
//         var type = img.mediaType
//         var onlyType = type.slice(6, type.length)
//         this.mediaObj = {
//           imageFile: img.dataURI.split(',')[1],
//           imageType: onlyType,
//           mode:"gallery"
//         };
//       })
//       .catch((error: any) => console.error(error));

// }

async takeFromGallery(){

   this.chooser.getFile()
      .then(file => {

       console.log('file==============>>>',file);
       const img: any = file;
       this.customObject = {
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
      
      console.log('customObject:+++++++++++++++++++++ ', this.customObject);
      
      return this.customObject;
      
    })
    .catch((error: any) =>{
       console.error(error)
       return null;
      });


    
}



}
