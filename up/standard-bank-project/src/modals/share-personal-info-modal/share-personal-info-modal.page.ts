import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-share-personal-info-modal',
  templateUrl: './share-personal-info-modal.page.html',
  styleUrls: ['./share-personal-info-modal.page.scss'],
})
export class SharePersonalInfoModalPage implements OnInit {

  @Input() pin: string;
  @Input() qrCode: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
