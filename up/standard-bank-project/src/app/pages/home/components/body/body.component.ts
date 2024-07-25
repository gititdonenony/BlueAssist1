import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";

import { NavController } from "@ionic/angular";
import { Subscription } from "rxjs";

import { GlobalService } from "../../../../services/global.service";

@Component({
  selector: "app-body",
  templateUrl: "./body.component.html",
  styleUrls: ["./body.component.scss"],
})
export class BodyComponent implements OnInit, OnDestroy {
  isIPhone = false;
  showBottomBar = false;

  routeSubscription: Subscription;

  @ViewChild("router", { static: true }) router: ElementRef;

  constructor(
    private route: Router,
    private nav: NavController,
    private global: GlobalService
  ) {
    this.isIPhone = this.global.isIOS();
  }

  ngOnInit() {
    const validPages = [
      "/home/accident",
      "/home/snap",
      "/home/scan",
      "/home/submit",
    ];
    this.routeSubscription = this.route.events.subscribe((event: any) => {
      if (!event.url) {
        return;
      }

      if (event.url === "/home/snap") {
        this.moveSelectionBar(0);
      } else if (event.url === "/home/scan") {
        this.moveSelectionBar(1);
      } else if (event.url === "/home/submit") {
        this.moveSelectionBar(2);
      } else {
        this.moveSelectionBar(-1);
      }

      if (validPages.indexOf(event.url) > -1) {
        this.showBottomBar = true;
      } else {
        this.showBottomBar = false;
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  async goToPage(page: string) {
    await this.nav.navigateForward(`/home/${page}`, { animated: true });
  }

  private async moveSelectionBar(index: number) {
    const bar = document.querySelector(".selected-bar") as HTMLElement;
    await this.waitForRender(bar);
    if (index < 0) {
      bar.style.transform = `translateX(-${bar.clientWidth}px)`;
    } else {
      const partWidth = document.querySelector("ion-card").clientWidth / 3;
      const amountToMoveTo =
        partWidth * index + partWidth / 2 - bar.clientWidth / 2;
      bar.style.transform = `translateX(${amountToMoveTo}px)`;
    }
  }

  private waitForRender(elem: HTMLElement) {
    return new Promise(resolve => {
      const check = () => {
        if (elem.clientWidth > 0) {
          return resolve;
        } else {
          setTimeout(() => {
            check();
          });
        }
      };
      check();
    });
  }
}
