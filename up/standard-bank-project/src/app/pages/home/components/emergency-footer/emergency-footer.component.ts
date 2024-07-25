import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

import { EmergencyFooterService, footerAnimations } from './emergency-footer.service';

import { MessageBusService } from '../../../../services/messagebus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-emergency-footer',
  templateUrl: './emergency-footer.component.html',
  styleUrls: ['./emergency-footer.component.scss'],
  providers: [
    EmergencyFooterService
  ],
  animations: footerAnimations
})
export class EmergencyFooterComponent implements OnInit, OnDestroy {

  isEmergencyContactsOpen = false;
  emergencies: any;
  isIPhone = false;

  toggleSubscription: Subscription;

  @Output() openOverlay = new EventEmitter();
  @Output() closeOverlay = new EventEmitter();

  constructor(private service: EmergencyFooterService,
              private messageBus: MessageBusService) {
    this.isIPhone = this.service.isIOS();
  }

  ngOnInit() {
    this.emergencies = this.service.emergencyNumbers;
    this.toggleSubscription = this.messageBus.subscribeToEmergencyToggleMessageBus().subscribe(() => {
      this.toggle();
    });
  }

  ngOnDestroy() {
    this.toggleSubscription.unsubscribe();
  }

  toggle() {
    this.isEmergencyContactsOpen = !this.isEmergencyContactsOpen;
    if (this.isEmergencyContactsOpen) {
      this.openOverlay.emit();
    } else {
      this.closeOverlay.emit();
    }
  }

  async footerPanned(evt) {
    if (evt.additionalEvent === 'pandown') {
      this.isEmergencyContactsOpen = false;
      this.closeOverlay.emit();
    }
  }

  async placeCall(contactName: string) {
    const contact = this.service.emergencyNumbers.find(x => x.Name === contactName);
    if (contact) {
      await this.placeEmergencyCall(contact);
    }
  }

  async placeEmergencyCall(emergencyDetails: any) {
    await this.service.placeEmercengyCall(emergencyDetails);
  }

}
