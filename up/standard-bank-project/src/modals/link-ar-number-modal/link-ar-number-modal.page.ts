import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, NavParams ,ToastController} from '@ionic/angular';
import { LinkArNumberService } from './link-ar-number.service';
import { UserService } from '../../app/api/user.service'
import { ArLinkModel } from 'src/app/api/Model/claim.model';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-link-ar-number-modal',
  templateUrl: './link-ar-number-modal.page.html',
  styleUrls: ['./link-ar-number-modal.page.scss'],
  providers: [LinkArNumberService]
})
export class LinkArNumberModalPage implements OnInit {
  header = '';
  description = '';
  image = '';
  title = '';
  arLinkModel: ArLinkModel;
  backButtonText = 'Back';
  continueButtonText = 'Continue';
  claim_id: any;
  arnolink: any;
  image_ar: string;
  Error: any;


  constructor(private modalController: ModalController, private toastctrl: ToastController, private storage:Storage, private navparms : NavParams , private router: Router, private alertctrl: AlertController, private service: LinkArNumberService,private user: UserService) {
    this.arLinkModel=new ArLinkModel()
   }

  ngOnInit() {
    this.claim_id = this.navparms.get('id_ar');
    console.log(this.claim_id)
  }

  async captureImage(side: string) {
    const img = await this.service.captureImage();
    
    if (img) {
          this.image = `${img.Base64}`;
      }

      let response=await this.service.saveImage(img);

      response.subscribe((result:any)=>
        {
          console.log(result);
          // this.rightImage1=result.data.imagepath;
          // console.log(this.rightImage1);
          if(result.operation=='success')
          {
            this.arLinkModel.ar_form_image = result.data.imagename
              this.image=result.data.imagepath;
              console.log(this.image)
          // switch (side) {
          //   case 'Front':
          //     this.accidentSceneModel.front_image = result.data.imagename
          //     this.frontImage=result.data.imagepath;
          //     break;
          //   case 'Right':
          //     this.accidentSceneModel.right_image = result.data.imagename;
          //     this.rightImage=result.data.imagepath;
          //     break;
          //   case 'Back':
          //     this.accidentSceneModel.back_image = result.data.imagename;
          //     this.backImage=result.data.imagepath;
          //     break;
          //   case 'Left':
          //     this.accidentSceneModel.left_image= result.data.imagename;
          //     this.leftImage=result.data.imagepath;
          //     break;
          // }
        }

        })
      // let ima=this.service.rightImage1;
      // console.log(ima)
      // this.image=ima;

       console.log(this.image)
      
    }

    public rightImage1:string='';

  continue(){
    console.log(this.image)
    const alert =  this.alertctrl.create({
         
      header: "Terms and Conditions",
      backdropDismiss:false,
      cssClass:'TandC-alert',
      message: `<p style="font-size: 12px;font-weight: 900;">I/We understand that the completion of 
      this form does not bind the Company 
      to payment of any claim. I/We further
      declare that the foregoing particulars 
      are true in every respect and that I/we 
      have not withheld from the Company
      any information connected with the 
      loss.</p>`,
     
      buttons: [
     {
          text: 'ACCEPT',
          handler: () => {
            return new Promise(resolve => {
              let body = {
           
                "claim_id":this.claim_id ,
                "ar_number": this.arnolink ,
                "ar_doc_image":this.image,
              }
              this.storage.get('WbAuth').then(token => {
              this.user.postArNo(body,'ar-number',token).subscribe((res: any) => {
                console.log(res);
                 if(res.operation == "success")
                 {
                  this.router.navigateByUrl("/thank-you-claim-submitted", { state: this.claim_id });
                // this.nav.navigateRoot(['/thank-you-claim-submitted', { state: this.claim_id }]);
                 this.modalController.dismiss();
                 }
                 else{
                  console.log('error')
                  this.Error = res.message;
                 this.presentToast(res.message);
                  console.log(res.message);
                  this.modalController.dismiss();
                 }
              })
            })
          })
    
          }
        }
      ]
    }).then(alertEt =>{
      alertEt.present();
     }) 
  
    }

    
    fail(){
      this.modalController.dismiss();
    }


  //   linkArNumber() {
  //     return new Promise(resolve => {
  //       let body = {
     
  //         "id":this.claim_id ,
  //         "arno": this.arnolink ,
  //         "img":this.image_ar ,
  //       }
  //       this.user.postArNo.(body).subscribe((res: any) => {
  //         console.log(res);
  //       })
  //     })
  //  }
  
  async presentToast(a) {
    const toast = await this.toastctrl.create({
      message: a,
      duration: 3000,
      position: 'top'
    });
   
    toast.present();
  }

  async close() {
    await this.modalController.dismiss(null, 'close');
  }
}
