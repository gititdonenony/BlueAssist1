import { Component, OnInit, NgZone } from '@angular/core';

import { ArFormHistoryDetailsService } from './ar-form-history-details.service';
import { IArFormHistory } from 'src/services/models.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ar-form-history-details',
  templateUrl: './ar-form-history-details.page.html',
  styleUrls: ['./ar-form-history-details.page.scss'],
  providers: [
    ArFormHistoryDetailsService
  ]
})
export class ArFormHistoryDetailsPage implements OnInit {

  accident: IArFormHistory;
  buttonsDisabled = false;
  downloadProgress = 0;
  private downloadFormSubscription: Subscription;

  constructor(private service: ArFormHistoryDetailsService,
              private zone: NgZone) { }

  async ngOnInit() {
    await this.service.initialize(this.accident);
  }

  ionViewWillLeave() {
    if (this.downloadFormSubscription) {
      this.downloadFormSubscription.unsubscribe();
    }
    this.service.cleanUp();
  }

  async close() {
    await this.service.close();
  }

  async resendForm() {
    this.buttonsDisabled = true;
    this.downloadProgress = 0;
    await this.service.resendForm();
    this.buttonsDisabled = false;
    this.downloadProgress = 0;
  }

  async downloadForm() {
    this.downloadProgress = 0;
    this.buttonsDisabled = true;
    this.downloadFormSubscription = this.service.subscribeToFormDownloadProgress().subscribe(x => {
      this.zone.run(() => {
        this.downloadProgress = (x / 100);
        console.log(this.downloadProgress);
      });
    });
    await this.service.downloadArForm();
    this.downloadFormSubscription.unsubscribe();
    this.downloadFormSubscription = null;
    this.downloadProgress = 0;
    this.buttonsDisabled = false;
  }

}
