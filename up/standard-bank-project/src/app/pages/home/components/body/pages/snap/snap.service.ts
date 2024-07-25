import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

import { MessageBusService } from '../../../../../../services/messagebus.service';
import { StorageService, Prefixes } from '../../../../../../services/storage.service';
import { GlobalService } from '../../../../../../services/global.service';
import { IButtonInformation } from '../../../../../../services/models.service';

// import { GenericPopupPage } from '../../../../../../modals/generic-popup/generic-popup.page';
import { GenericPopupPage } from 'src/app/generic-popup/generic-popup.page';


@Injectable()
export class SnapService {

  private popupSettings = {
    AccidentScene: {
      Header: 'Snap Accident Scene',
      Title: 'Do this before moving<br> your vehicle!',
      Description: [
        'Capture the following: <br> 1.Front of the Accident Scene <br>2.Right of the Accident Scene<br> 3.Back of the Accident Scene <br> 4.Left of the Accident Scene'
      ],
      Image: 'assets/lottie/animation_640_lhoy3rlp.gif',
      Layover: 'assets/lottie/snap-accident-scene.png',
      OnContinue: '/accident-reporting/snap/accident-scene',

    },
    YourVehicleDamage: {
      Header: 'Snap Evidence',
      Title: 'Please tap the vehicle damage<br> options that are relevant to you',
      Description: [
        'Please note you must snap vehicle <br>evidence by each section'
      ],
      // Image: 'assets/lottie/tap-tap.json',
      Image: 'assets/lottie/NoPath.gif' ,
      OnContinue: '/accident-reporting/snap/your-vehicle-damage'
    },
    TheirVehicleDamage: {
      Header: 'Snap Evidence',
      Title: 'Please tap the vehicle damage<br> options that are relevant to you',
      Description: [
        'Please note you must snap vehicle<br> evidence by each section'
      ],
      // Image: 'assets/lottie/tap-tap.json',
      Image: 'assets/lottie/NoPath.gif',
      OnContinue: '/accident-reporting/snap/their-vehicle-damage'
    },
    RoadConditions: {
      Header: 'Snap Evidence',
      Title: 'Please tap the vehicle condition<br> options that are relevant to you',
      Description: [
        'Please note you must snap vehicle<br> evidence by each section'
      ],
      // Image: 'assets/lottie/tap-tap.json',
      Image: 'assets/lottie/NoPath.gif',
      OnContinue: '/accident-reporting/snap/road-conditions'
    }
  };

  private buttons: IButtonInformation[] = [
    {
      Text: 'ACCIDENT SCENE',
      ButtonName: 'AccidentScene',
      Icon: 'assets/icons/accident-scene1.svg',
      IconInverse: 'assets/icons/accident-scene.svg',
      State: 0
    },
    {
      Text: 'YOUR VEHICLE DAMAGE',
      ButtonName: 'YourVehicleDamage',
      Icon: 'assets/icons/your-vehicle-white.svg',
      IconInverse: 'assets/icons/your-vehicle.svg',
      State: 0
    },
    {
      Text: 'THEIR VEHICLE DAMAGE',
      ButtonName: 'TheirVehicleDamage',
      Icon: 'assets/icons/their-vehicle-white.svg',
      IconInverse: 'assets/icons/Theirvehicle.svg',
      State: 0
    },
    {
      Text: 'ROAD CONDITIONS',
      ButtonName: 'RoadConditions',
      Icon: 'assets/icons/road-conditions-white.svg',
      IconInverse: 'assets/icons/road-conditions.svg',
      State: 0
    }
  ];

  constructor(private nav: NavController,
              private messageBus: MessageBusService,
              private storage: StorageService,
              private global: GlobalService) { }

  subscribeToPageEvents() {
    return this.messageBus.subscribeToHomePageMessageBus();
  }

  async saveStates(states: any) {
    await this.storage.set(`${Prefixes.PageButtonStates}SNAP`, states);
  }

  async getStates() {
    const states = await this.storage.get(`${Prefixes.PageButtonStates}SNAP`);
    if (!states) {
      return {};
    }
    return states;
  }

  async getButtons() {
    const states = await this.getStates();
    for (const buttonState in states) {
      if (buttonState) {
        const button = this.buttons.find(x => x.ButtonName === buttonState);
        if (button) {
          button.State = states[buttonState];
        }
      }
    }
    return this.buttons;
  }

  async goBack() {
    await this.nav.navigateBack('/home/accident', { replaceUrl: true, animated: true });
  }

  async navigateToPage(page: string) {
    await this.showPopup(this.popupSettings[page]);
  }

  private async showPopup(settings: PopupSettings) {
    const modal = await this.global.modal(GenericPopupPage, {
      header: settings.Header,
      description: settings.Description,
      title: settings.Title,
      image: settings.Image,
      layoverImage: settings.Layover,
      backButtonText: settings.BackButton,
      continueButtonText: settings.ContinueButton
    }, 'small-popup');

    const result = await modal.onDidDismiss();
    if (result.data) {
      await this.nav.navigateForward(settings.OnContinue, { animated: true });
    } else if (result.role === 'fail' && settings.OnBack) {
      await this.nav.navigateForward(settings.OnBack, { animated: true });
    }
  }
}

interface PopupSettings {
  Header: string;
  Title: string;
  Description: string[];
  Image: string;
  Layover?: string;
  BackButton: string;
  ContinueButton: string;
  OnBack: string;
  OnContinue: string;
  OnClose?: string;
}
