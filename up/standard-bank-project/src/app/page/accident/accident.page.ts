import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-accident',
  templateUrl: './accident.page.html',
  styleUrls: ['./accident.page.scss'],
})
export class AccidentPage implements OnInit {
  orderObj: any;
  alldata: string;
  constructor(private nav: NavController,private route: ActivatedRoute) { }

  ngOnInit() {
     // this.route.paramMap.subscribe(params => {
    //   this.alldata = params.get(userid);
    // });
    if(this.route.snapshot.params.userid != null){
      this.alldata = this.route.snapshot.params.userid;
      console.log(this.route.snapshot.params.userid);
      console.log(this.alldata);
    }
  }
  async goBack() {
    await this.nav.navigateBack('/home/start', { replaceUrl: true, animated: true });
  }
  async changeBodyPage(page: string) {
    await this.nav.navigateForward(`/home/${page}`, { animated: true });
  }
}
