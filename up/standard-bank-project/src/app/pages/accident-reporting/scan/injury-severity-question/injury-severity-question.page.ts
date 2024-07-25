import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { IIconRadioOption } from '../../../../services/models.service';
import { PageBuilderService } from '../../../../services/pagebuilder.service';
import { GlobalService } from '../../../../services/global.service';

import { GenericPopupPage } from 'src/app/generic-popup/generic-popup.page';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-injury-severity-question',
  templateUrl: './injury-severity-question.page.html',
  styleUrls: ['./injury-severity-question.page.scss'],
})
export class InjurySeverityQuestionPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };
  driverInjuredOptions: IIconRadioOption[];
  selectedInjuryOption = 0;
  type = '';


  public content_visibility: any;
  public scannedResult: any;
  public page: string;

  constructor(private pageBuilder: PageBuilderService,
              private nav: NavController,
              private global: GlobalService,
              private navController: NavController,
              
              ) { }

  ngOnInit() {
    this.driverInjuredOptions = this.pageBuilder.severityOfInjuryOptions();
    this.type = new URLSearchParams(window.location.search).get('type');
  }

  saveSelection(option: IIconRadioOption) {
    this.selectedInjuryOption = option.ID;
  }

  async backClicked() {
    await this.nav.pop();
  }

  async nextClicked() {
    if (!this.selectedInjuryOption) {
      await this.global.toast('Please select how injured the passenger is');
    } else {
      const isMinimal = this.selectedInjuryOption === 4;
     const modalData = await this.showPopup(isMinimal);

    }
  }

  private async showPopup(isMinimal: boolean) {
    const modal = await this.global.modal(GenericPopupPage, {
      header: `Scan ${this.type.substr(0, 1).toUpperCase()}${this.type.substr(1)} Smart ID`,
      description: [
        'Please note you can fill in the data if you don\'t have a smart ID'
      ],
      title: 'Position your camera close to the barcode located on the SMART ID ',
      image: 'assets/lottie/scan-smart-id_72044eb1.gif',
      backButtonText: 'Fill',
      continueButtonText: 'Scan'
    }, 'small-popup');

    const result = await modal.onDidDismiss();
    let shouldScan = null;
    if (result.data) {
      shouldScan = true;

      console.log('result.data%%%%%%%%%%%%%%%%%%', result.data)
     
      // // startScan -----------------------code------------------------------------------------
      //   try {
      //     const permission = await this.checkPermission();
      //     if (!permission) {
      //       return;
      //     }
      //     await BarcodeScanner.hideBackground();
      //     document.querySelector('body').classList.add('scanner-active');
      //     this.content_visibility = 'hidden';
      //     const result = await BarcodeScanner.startScan();
      //     // console.log('result--------->>',result);
      //     BarcodeScanner.showBackground();
      //     document.querySelector('body').classList.remove('scanner-active');
      //     this.content_visibility = '';
      //     if (result?.hasContent) {
      //       this.scannedResult = result.content;
    
      //       console.log('scannedResult--------->>>>>>>>', this.scannedResult);
    
      //       if (this.type === 'passenger') {
      //         if (this.scannedResult.includes('|')) {
      //           let scannedData = this.scannedResult.split('|');
      //           if (scannedData?.length > 0) {
      //             localStorage.setItem(`scannedData_${this.type}`, JSON.stringify(scannedData));
      //           }
      //         }
    
      //       } else if (this.type === 'cyclist') {
      //         if (this.scannedResult.includes('%')) {
      //           let scannedData = this.scannedResult.split('%');
      //           if (scannedData?.length > 0) {
      //             localStorage.setItem(`scannedData_${this.type}`, JSON.stringify(scannedData));
      //           }
      //         }
      //       } else if (this.type === 'pedestrian') {
      //         if (this.scannedResult.includes('|')) {
      //           let scannedData = this.scannedResult.split('|');
      //           if (scannedData?.length > 0) {
      //             localStorage.setItem(`scannedData_${this.type}`, JSON.stringify(scannedData));
      //           }
      //         }
    
      //       } 
      
    
      //       if (shouldScan === true || shouldScan === false) {
      //         await this.nav.navigateForward(`/accident-reporting/scan/passenger-info-capture?type=${this.type}&scan=${shouldScan}&minimal=${isMinimal}&injuryType=${this.selectedInjuryOption}&editId=0`, {
      //           animated: true,
      //           replaceUrl: true
      //         });
      //       }
    
      //     }
      //   } catch (e) {
      //     console.log(e);
      //     this.stopScan();
      //   }

      //---------------------------------------------scanner code end-------------------------------------------------------------------
      
    } else if (result.role === 'fail') {
      shouldScan = false;
    }
    if (shouldScan === true || shouldScan === false) {
      await this.nav.navigateForward(`/accident-reporting/scan/passenger-info-capture?type=${this.type}&scan=${shouldScan}&minimal=${isMinimal}&injuryType=${this.selectedInjuryOption}&editId=0`, {
        animated: true,
        replaceUrl: true
      });
    }
  }


//---------------------------------------------scanner code--------------------------------------------------------------------------------

  // public stop(): void {
  //   this.navController.pop();
  // }


  // async checkPermission() {
  //   try {
  //     const status = await BarcodeScanner.checkPermission({ force: true });
  //     if (status.granted) {
  //       return true;
  //     }
  //     return false;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

 

  // stopScan() {
  //   BarcodeScanner.showBackground();
  //   BarcodeScanner.stopScan();
  //   document.querySelector('body').classList.remove('scanner-active');
  //   this.content_visibility = '';
  // }


  // ngOnDestroy() {
  //   this.stopScan(); 
  // }

  //-----------------------------------scanner code end--------------------------------------------------------------------------------------------------

}
