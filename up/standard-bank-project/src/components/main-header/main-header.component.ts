import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { IonMenu } from "@ionic/angular";

import { MainHeaderService, PageAnimations } from "./main-header.service";

import { IUserModel } from "../../services/models.service";
import { LoggerService } from "../../services/logger.service";

import { Subscription } from "rxjs";

@Component({
  selector: "app-main-header",
  templateUrl: "./main-header.component.html",
  styleUrls: ["./main-header.component.scss"],
  providers: [MainHeaderService],
  animations: PageAnimations,
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  @ViewChild("mainMenu", { static: true }) mainMenu: IonMenu;
  isPopable = true;
  isLoggedIn = false;
  userDetails: IUserModel;

  private loginStatusSubscription: Subscription;

  constructor(
    private service: MainHeaderService,
    private logger: LoggerService
  ) {}

  async ngOnInit() {
    const initData = await this.service.initialize(this.mainMenu);
    this.isPopable = initData.CanPop;
    this.isLoggedIn = initData.IsLoggedIn;
    this.userDetails = initData.UserDetail;

    this.loginStatusSubscription = this.service
      .subscribeToLoginStatus()
      .subscribe(async () => {
        const userDetails = await this.service.getUserDetails();
        if (userDetails) {
          this.isLoggedIn = true;
          this.logger.setUserId(userDetails.Id);
        } else {
          this.isLoggedIn = false;
          this.logger.setUserId("");
        }
        this.userDetails = userDetails;
      });

    initData.RouteWatcher.subscribe(canpop => {
      this.isPopable = canpop;
    });
  }

  ngOnDestroy() {
    if (this.loginStatusSubscription)
      this.loginStatusSubscription.unsubscribe();
  }

  async goToHome() {
    await this.service.goToHome();
  }

  async closeMenu() {
    await this.service.closeMenu();
  }

  async openMenu() {
    await this.service.openMenu();
  }

  async goBack() {
    await this.service.goBack();
  }

  async goToHistory() {
    await this.service.goToHistory();
  }

  async contactUs() {
    await this.service.contactUs();
  }

  async aboutUs() {
    await this.service.aboutUs();
  }

  async privacy() {
    await this.service.privacy();
  }

  async login() {
    await this.service.login();
  }

  async logOut() {
    await this.service.logOut();
  }
}
