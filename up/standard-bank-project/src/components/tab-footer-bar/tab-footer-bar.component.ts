import { Component, AfterViewInit, OnInit, OnDestroy } from "@angular/core";

import { Router } from "@angular/router";

import { NavController, AlertController } from "@ionic/angular";
import { Subscription } from "rxjs";

@Component({
  selector: "app-tab-footer-bar",
  templateUrl: "./tab-footer-bar.component.html",
  styleUrls: ["./tab-footer-bar.component.scss"],
})
export class TabFooterBarComponent implements AfterViewInit, OnInit, OnDestroy {
  bubble: HTMLElement;
  activePage = "dashboard";
  isSmallPhone = false;
  currentIndex = 2;
  public timer = 1;
  public m = 1;

  private routeSubscription: Subscription;

  activeTabName: string = "dashboard";

  constructor(
    private nav: NavController,
    private alertctrl: AlertController,
    private route: Router
  ) {}

  ngAfterViewInit() {
    this.isSmallPhone = window.innerHeight < 680 ? true : false;

    // this.bubble = document.querySelector('.selected-bubble');
    // const waitForLoad = () => {
    //   if (this.bubble.clientWidth > 0) {
    //     this.moveBubble();
    //   } else {
    //     setTimeout(() => {
    //       waitForLoad();
    //     });
    //   }
    // };
    // waitForLoad();
  }

  ngOnInit() {
    this.routeSubscription = this.route.events.subscribe(async (event: any) => {
      if (!event.url) {
        return;
      }

      let newIndex = -1;
      let newActivePage = "";
      if (event.url === "/claims-history") {
        newIndex = 0;
        newActivePage = "claims-history";
        this.activeTabName = "claims";
      }
      // else if (event.url === '/repairs') {
      //   newIndex = 1;
      //   newActivePage = 'repairs';
      // }
      else if (event.url === "/licence") {
        newIndex = 2;
        newActivePage = "licence";
        this.activeTabName = "licence";
      }
      // else if (event.url === '/car-hire') {
      //   newIndex = 4;
      //   newActivePage = 'car-hire';
      // }
      else {
        newIndex = 1;
        newActivePage = "dashboard";
        // this.reloadCurrentPage();
        this.activeTabName = "dashboard";
      }
      if (newIndex !== this.currentIndex || newActivePage !== this.activePage) {
        this.currentIndex = newIndex;
        this.activePage = newActivePage;
        //this.moveBubble();
      }
    });
  }

  reloadCurrentPage() {
    window.location.reload();
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  async goTo(page: string, index: number) {
    this.currentIndex = index;
    //this.moveBubble();
    this.activePage = page;
    this.nav.navigateRoot(`/${page}`, { animated: true });

    if (page == "home") {
      // this.emergency();
      // this.nav.navigateRoot(`/`, { animated: true });
    } else {
      this.nav.navigateRoot(`/${page}`, { animated: true });
    }
  }
  thankyoutimer() {
    var IntervalVar = setInterval(
      function () {
        this.timer--;

        if (this.timer === 0) {
          this.timer = 1;

          this.m -= 1;
        }

        if (this.m === 0) {
          // this.timer = "00";

          //this.m = "00"

          //this.nav.navigateRoot(['/dashboard']);
          // this.DismissLoading
          this.emAlert.dismiss();
          this.emAlert = null;
          this.timer = 1;
          this.m = 1;
          this.nav.navigateRoot(["/dashboard"]);
          // this.alertEt.On();

          clearInterval(IntervalVar);
          console.log(IntervalVar);
        }
      }.bind(this),
      1000
    );
  }

  // emergency(){
  //   const alert =  this.alertctrl.create({

  //     header: "Emergency",
  //     backdropDismiss:false,
  //     cssClass:'my-custom-class',
  //     message: `<img src="assets/avtar-img/emergancy.png
  //     " class="card-alert"><p style="font-size: 12px;font-weight: 900;">This will instantly
  //      notify us of your emergency and get an agent to contact you</p>`,

  //     buttons: [
  //       {
  //         text: 'No',

  //         handler: (blah) => {
  //             this.nav.navigateRoot(['/dashboard']);
  //           console.log('Confirm Cancel: blah');
  //         }
  //       }, {
  //         text: 'Yes',
  //         handler: () => {
  //           this.thankyou();
  //     // this.nav.navigateRoot(['/dashboard']);
  //           console.log('Confirm Okay');
  //         }
  //       }
  //     ]
  //   }).then(alertEt =>{
  //     alertEt.present();
  //    })

  //    //alert.present();
  //   }

  //   emAlert:any
  //  async thankyou(){
  //     const alert = await this.alertctrl.create({

  //       // header: "Emergency",
  //      backdropDismiss:true,

  //       cssClass:'my-custom-class',
  //       message: `<img src="assets/avtar-img/Path4467.png" class="card-alert"><p style="font-size:15px;">Thank
  //        you, we will be  touch with you shortly to assist you</p>`,

  //     });
  //       this.emAlert=alert;
  //       await alert.present();

  //        this. thankyoutimer();

  //       //this.nav.navigateRoot(['/dashboard']);

  //       // return { deleted: true };
  //       //alertEt.onDidDismiss();

  //   }

  // private moveBubble() {
  //   const partWidth = window.innerWidth / 3;
  //   const xAmount = ((partWidth * this.currentIndex) + (partWidth / 2)) - (this.bubble.clientWidth / 2);

  //   this.bubble.style.transform = `translateX(${xAmount}px) translateY(${(this.isSmallPhone ? 0 : -26)}px)`;
  // }
}
