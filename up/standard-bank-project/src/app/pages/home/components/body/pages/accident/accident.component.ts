import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-accident',
  templateUrl: './accident.component.html',
  styleUrls: ['./accident.component.scss'],
})
export class AccidentComponent implements OnInit {
  orderObj: any;
  alldata: string;

  constructor(private nav: NavController,private route: ActivatedRoute,
    private router: Router,
    ) { 

  }

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

  // async goBack() {
  //   await this.nav.navigateBack('/home/start', { replaceUrl: true, animated: true });
  // }

  async changeBodyPage(page: string) {
    await this.nav.navigateForward(`/home/${page}`, { animated: true });
  }
  async dashboard(){
    // await this.nav.navigate('/tabs/profile', { replaceUrl: true, animated: true });
    this.router.navigate(['/tabs/profile']);
  }
}
