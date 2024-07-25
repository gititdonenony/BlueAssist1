import { Injectable } from '@angular/core';

import { NavController } from '@ionic/angular';

import { GlobalService } from '../../../../../../services/global.service';
import { MessageBusService } from '../../../../../../services/messagebus.service';
import { StorageService, Prefixes } from '../../../../../../services/storage.service';
import { IButtonInformation } from '../../../../../../services/models.service';


// import { GenericPopupPage } from '../../../../../../modals/generic-popup/generic-popup.page';
import { GenericPopupPage } from 'src/app/generic-popup/generic-popup.page';

@Injectable()
export class ScanService {

    private popupSettings = {
        OtherDriverInfo: {
            Header: 'Scan Drivers Smart ID',
            Title: 'Position your camera close to <br>the barcode located on the <br>SMART ID',
            Description: 'Please note you can fill in the data if<br> you don\'t have a smart ID',
            Image: 'assets/lottie/scan-smart-id_72044eb1.gif',
            BackButton: 'Fill IN',
            ContinueButton: 'Scan',
            OnBack: '/accident-reporting/scan/other-driver-info?scan=false',
            OnContinue: '/accident-reporting/scan/other-driver-info?scan=true'
        },
        YourInfo: {
            Header: 'Scan Your Smart ID',
            Title: 'Position your camera close to <br> the barcode located on the<br> SMART ID',
            Description: 'Please note you can fill in the data if <br> you don\'t have a smart ID',
            Image: 'assets/lottie/scan-smart-id_72044eb1.gif',
            BackButton: 'Fill IN',
            ContinueButton: 'Scan',
            OnBack: '/accident-reporting/scan/your-info?scan=false',
            OnContinue: '/accident-reporting/scan/your-info?scan=true'
        },
        OtherVehicleInfo: {
            Header: 'Scan Other Drivers Vehicle Disk',
            Title: 'Position your camera close to <br> the vehicle disk located on the VEHICLE LICENCE DISK.',
            Description: 'Please note you can fill in the<br> information as well',
            Image: 'assets/lottie/fdhfghfdjhfdh.gif',
            // LayoverImage: 'assets/icons/vehicle-info-black.svg',
            BackButton: 'Fill IN',
            ContinueButton: 'Scan',
            OnBack: '/accident-reporting/scan/other-vehicle-info?scan=false',
            OnContinue: '/accident-reporting/scan/other-vehicle-info?scan=true'
        },
        YourVehicleInfo: {
            Header: 'Scan Your <br>Vehicle Disk',
            Title: 'Position your camera close to <br>the vehicle disk located on the VEHICLE LICENCE DISK.',
            Description: 'Please note you can fill in the<br> information as well',
            Image: 'assets/lottie/fdhfghfdjhfdh.gif',
            // LayoverImage: 'assets/icons/vehicle-info-black.svg',
            BackButton: 'Fill IN',
            ContinueButton: 'Scan',
            OnBack: '/accident-reporting/scan/your-vehicle-info?scan=false',
            OnContinue: '/accident-reporting/scan/your-vehicle-info?scan=true'
        },
        PassengerInfo: {
            OnContinue: '/accident-reporting/scan/passenger-info?type=passenger'
        },
        CyclistInfo: {
            OnContinue: '/accident-reporting/scan/passenger-info?type=cyclist'
        },
        PedestrianInfo: {
            OnContinue: '/accident-reporting/scan/passenger-info?type=pedestrian'
        },
        WitnessInfo: {
            Header: 'Scan Witness<br> Smart ID',
            Title: 'Position your camera close to the vehicle disk located on the VEHICLE LICENCE DISK.',
            Description: 'Please note you can fill in the <br>information as well',
            Image: 'assets/lottie/scan-smart-id_72044eb1.gif',
            BackButton: 'Fill IN',
            ContinueButton: 'Scan',
            OnBack: '/accident-reporting/scan/witness-info?scan=false',
            OnContinue: '/accident-reporting/scan/witness-info?scan=true'
        }
    };

    private buttons: IButtonInformation[] = [
        {
            Text: 'Other Drivers Info',
            ButtonName: 'OtherDriverInfo',
            Icon: 'assets/icons/personal-info.svg',
            IconInverse: 'assets/icons/smart-id.svg',
            State: 0
        },
        {
            Text: 'Other Drivers Vehicle Info',
            ButtonName: 'OtherVehicleInfo',
            Icon: 'assets/icons/vehicle-info.svg',
            IconInverse: 'assets/icons/vehicle-disk.svg',
            State: 0
        },
        {
            Text: 'Your Personal Info',
            ButtonName: 'YourInfo',
            Icon: 'assets/icons/personal-info.svg',
            IconInverse: 'assets/icons/smart-id.svg',
            State: 0
        },
        {
            Text: 'Your Vehicle Info',
            ButtonName: 'YourVehicleInfo',
            Icon: 'assets/icons/vehicle-info.svg',
            IconInverse: 'assets/icons/vehicle-disk.svg',
            State: 0
        },
        {
            Text: 'Passengers Involved',
            ButtonName: 'PassengerInfo',
            Icon: 'assets/icons/passenger-info.svg',
            IconInverse: 'assets/icons/passenger.svg',
            State: 0
        },
        {
            Text: 'Cyclists Involved',
            ButtonName: 'CyclistInfo',
            Icon: 'assets/icons/cyclist-info.svg',
            IconInverse: 'assets/icons/directions_bike.svg',
            State: 0
        },
        {
            Text: 'Pedestrians Involved',
            ButtonName: 'PedestrianInfo',
            Icon: 'assets/icons/witness-info.svg',
            IconInverse: 'assets/icons/emoji_people.svg',
            State: 0
        },
        {
            Text: 'Witness Info',
            ButtonName: 'WitnessInfo',
            Icon: 'assets/icons/witness-info.svg',
            IconInverse: 'assets/icons/emoji_people.svg',
            State: 0
        },
    ];

    scannedResult: any;
    content_visibility = '';

    constructor(private nav: NavController,
                private global: GlobalService,
                private messageBus: MessageBusService,
                private storage: StorageService) { }

    subscribeToPageEvents() {
        return this.messageBus.subscribeToHomePageMessageBus();
    }

    async saveStates(states: any) {
        await this.storage.set(`${Prefixes.PageButtonStates}SCAN`, states);
    }

    async getStates() {
        const states = await this.storage.get(`${Prefixes.PageButtonStates}SCAN`);
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
        const settings: PopupSettings = this.popupSettings[page] as PopupSettings;
        if (settings.Header) {
            const resultPop = await this.showPopup(settings);
            console.log('resultPop---------+++++', resultPop);
            return resultPop;
        } else {
            await this.nav.navigateForward(settings.OnContinue, { animated: true });
        }
    }

    private async showPopup(settings: PopupSettings) {
        const modal = await this.global.modal(GenericPopupPage, {
            header: settings.Header,
            description: [settings.Description],
            title: settings.Title,
            image: settings.Image,
            layoverImage: settings.LayoverImage,
            backButtonText: settings.BackButton,
            continueButtonText: settings.ContinueButton
        }, 'small-popup');

        const result = await modal.onDidDismiss();
        if (result.data) {
            // await this.nav.navigateForward(settings.OnContinue, { animated: true });
            console.log('result.data----------->>', result.data);
            return result.data;

        } else if (result.role === 'fail' && settings.OnBack) {
            await this.nav.navigateForward(settings.OnBack, { animated: true });
        }
    }


    async navigatingToPage(page: string) {
        const settings: PopupSettings = this.popupSettings[page] as PopupSettings;
        if (settings.Header) {
            await this.nav.navigateForward(settings.OnContinue, { animated: true });
        }
    }
}

interface PopupSettings {
    Header: string;
    Title: string;
    Description: string;
    Image: string;
    LayoverImage?: string;
    BackButton: string;
    ContinueButton: string;
    OnBack: string;
    OnContinue: string;
    OnClose?: string;
}
