import { Injectable } from '@angular/core';

import { GlobalService } from '../../../../services/global.service';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { LoggerService } from '../../../../services/logger.service';

import { animate, style, trigger, state, transition } from '@angular/animations';
const animationDuration = 300;

export const footerAnimations = [
    trigger('footer', [
        state('open', style({
            backgroundColor: 'var(--ion-color-light)',
            transform: 'translateY(0) translateX(-50%)'
        })),
        state('open-ios', style({
            backgroundColor: 'var(--ion-color-light)',
            transform: 'translateY(0) translateX(-50%) translate3d(0,0,0)'
        })),
        state('closed', style({
            backgroundColor: 'var(--transparent-background)',
            transform: 'translateY(100%) translateX(-50%)'
        })),
        state('closed-ios', style({
            backgroundColor: 'var(--transparent-background)',
            transform: 'translateY(110%) translateX(-50%) translate3d(0,0,0)'
        })),
        transition('open <=> closed', [
            animate(animationDuration)
        ])
    ]),
];

@Injectable()
export class EmergencyFooterService {

    emergencyNumbers = [
        { Name: 'Emergency', DisplayNumber: '112', Number: '112' },
        { Name: 'Ambulance', DisplayNumber: '10177', Number: '10177' },
        { Name: 'Police', DisplayNumber: '10111', Number: '10111' },
        { Name: 'Bakwena N1/N4', DisplayNumber: '0800 22 59362', Number: '08002259362' },
        { Name: 'Emer-G-Med', DisplayNumber: '0860 007 911', Number: '0860007911' },
        { Name: 'ER24', DisplayNumber: '084 124', Number: '084124' },
        { Name: 'N3TC', DisplayNumber: '0800 63 4357', Number: '0800634357' },
        { Name: 'Netcare 911', DisplayNumber: '082 911', Number: '082911' },
        { Name: 'Track N4', DisplayNumber: '0800 8722 64', Number: '0800872264' },
    ];

    constructor(private callNumber: CallNumber,
                private global: GlobalService,
                private logger: LoggerService) { }

    isIOS() {
        return this.global.isIOS();
    }

    async placeEmercengyCall(details: any) {
        const result = await this.global.prompt(`Place call to '${details.Name}'
        <br />
        <br />
        <div class="alert-center-bold">
        ${details.Number}
        </div>`, [], 'Place Call', 'Cancel');

        if (!result) {
            return;
        }

        this.callNumber.callNumber(details.Number, true).catch((err) => {
            this.logger.error('EmergencyFooterService::placeEmercengyCall::callNumber', err);
            window.open(`tel:${details.Number}`);
        }).finally(() => {
            this.global.toast(`Calling ${details.Name}...`);
        });
    }
}
