import { Injectable } from '@angular/core';

import { NavController } from '@ionic/angular';

import { GlobalService } from '../../../../../../services/global.service';
import { MessageBusService } from '../../../../../../services/messagebus.service';
import { StorageService, Prefixes } from '../../../../../../services/storage.service';
import { IButtonInformation } from '../../../../../../services/models.service';

import { style, trigger, state } from '@angular/animations';

export const PageAnimations = [
    trigger('completed', [
        state('complete', style({ transform: 'scale(0.9)', opacity: '0.9' })),
        state('incomplete', style({ transform: 'scale(1)', opacity: '1' }))
    ])
];

@Injectable()
export class SubmitService {

    private popupSettings = {
        SpecialObservations: {
            OnContinue: '/accident-reporting/submit/special-observations'
        },
        DangerousGoods: {
            OnContinue: '/accident-reporting/submit/dangerous-goods'
        },
        SubmitAndEmail: {
            OnContinue: '/accident-reporting/submit/submit-and-email'
        },
    };

    private buttons: IButtonInformation[] = [
        {
            Text: 'SPECIAL OBSERVATIONS',
            ButtonName: 'SpecialObservations',
            Icon: 'assets/icons/special-observations.svg',
            IconInverse: 'assets/icons/visibility.svg',
            State: 0
        },
        {
            Text: 'DANGEROUS GOODS',
            ButtonName: 'DangerousGoods',
            Icon: 'assets/icons/dangerous-goods.svg',
            IconInverse: 'assets/icons/warning.svg',
            State: 0
        },
        {
            Text: 'SUBMIT AND EMAIL',
            ButtonName: 'SubmitAndEmail',
            Icon: 'assets/icons/email.svg',
            IconInverse: 'assets/icons/email-2.svg',
            State: 0
        }
    ];

    constructor(private nav: NavController,
                private messageBus: MessageBusService,
                private storage: StorageService) { }

    subscribeToPageEvents() {
        return this.messageBus.subscribeToHomePageMessageBus();
    }

    async saveStates(states: any) {
        await this.storage.set(`${Prefixes.PageButtonStates}SUBMIT`, states);
    }

    async getStates() {
        const states = await this.storage.get(`${Prefixes.PageButtonStates}SUBMIT`);
        if (!states) {
            return {};
        }
        return states;
    }

    async getButtons() {
        const states = await this.getStates();
        for (const buttonState in states) {
            if (state) {
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
        await this.nav.navigateForward(settings.OnContinue);
    }
}

interface PopupSettings {
    Header: string;
    Title: string;
    Description: string;
    Image: string;
    BackButton: string;
    ContinueButton: string;
    OnBack: string;
    OnContinue: string;
    OnClose?: string;
}
