import { Component, OnInit } from '@angular/core';

import { WitnessInfoService } from './witness-info.service';
import { FormGroup } from '@angular/forms';
import { WitnessInfo } from 'src/app/pages/tabs/Model/claim.model';

@Component({
  selector: 'app-witness-info',
  templateUrl: './witness-info.page.html',
  styleUrls: ['./witness-info.page.scss'],
  providers: [
    WitnessInfoService
  ]
})
export class WitnessInfoPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };
  personalInfoform: FormGroup;

  selectPopoverOptions = {
    message: 'Select the option that is best suited'
  };
  _witnessInfo:WitnessInfo;
 public  witnessData: any[] = [];
  constructor(private service: WitnessInfoService) {
    this._witnessInfo=new WitnessInfo();
    this.getWitnessInfo();
   }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const showScanner = urlParams.get('scan') === 'true';
    this.personalInfoform = this.service.buildForm(showScanner);
  }

  ionViewWillEnter() {
    this.witnessData = JSON.parse(localStorage.getItem('scannedData_WitnessInfo'));
    console.log('this.witnessData--------ionViewWillEnter------->>><<<<',this.witnessData);


}

  ionViewWillLeave() {
    const completionState = !this.personalInfoform.valid && !this.personalInfoform.dirty ? 0 : this.personalInfoform.valid ? 2 : 1;
    this.service.broadcastState(completionState);
  }

  async backClicked() {
    await this.service.finish(true);
  }

  async nextClicked() {

    this._witnessInfo.witness_info=this.personalInfoform.controls.WitnessType.value;
    this._witnessInfo.surname_initial=this.personalInfoform.controls.Surname.value;
    this._witnessInfo.home_address=this.personalInfoform.controls.HomeAddress.value;
    this._witnessInfo.post_code=this.personalInfoform.controls.PostCode.value;
    this._witnessInfo.cell_number=this.personalInfoform.controls.CellNumber.value;
    
    await this.service.finish(false);
    this.service.SaveWitnessInfo(this._witnessInfo);
  }

  async getWitnessInfo()
  {
    

    var response= await this.service.GetWitnessPersonalInfo();
    response.subscribe((result:any)=>{
      console.log(result);
      if(result.operation=='success')
      {
        
        this.personalInfoform.controls.WitnessType.setValue(result.data.witness_info);
        // this.personalInfoform.controls.Surname.setValue(result.data.surname_initial)
        this.personalInfoform.controls.Surname.setValue(this.witnessData[0])
        this.personalInfoform.controls.HomeAddress.setValue(result.data.home_address)
        this.personalInfoform.controls.PostCode.setValue(result.data.post_code)
        this.personalInfoform.controls.CellNumber.setValue(result.data.cell_number)

      }
    });
  }

  ngOnDestroy(){
    localStorage.removeItem('scannedData_WitnessInfo');

}

}
