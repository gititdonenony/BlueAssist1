import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { IonMenu, NavController } from '@ionic/angular';

import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

import { StorageService, Tables, Prefixes } from '../../services/storage.service';
import { IUserModel } from '../../services/models.service';
import { MessageBusService } from '../../services/messagebus.service';
import { GlobalService } from '../../services/global.service';
import { LoggerService } from '../../services/logger.service';

import { LoginSignupPage } from '../../modals/login-signup/login-signup.page';

import { Observable, Subscriber } from 'rxjs';

import { trigger, state, style, animate, transition } from '@angular/animations';
import { UserService } from 'src/app/api/user.service';

export const PageAnimations = [
    trigger('poppable', [
        state('menu-on', style({ transform: 'rotate(0deg)', opacity: '1' })),
        state('menu-off', style({ transform: 'rotate(-180deg)', opacity: '0' })),
        state('popper-on', style({ transform: 'rotate(0deg)', opacity: '1' })),
        state('popper-off', style({ transform: 'rotate(180deg)', opacity: '0' })),
        transition('* <=> *', [
            animate(200)
        ])
    ])
];

@Injectable()
export class MainHeaderService {

    mainMenu: IonMenu;
    private userDetails: IUserModel;
    private validHeaderUrls = ['/home', '/claims', '/repairs', '/car-hire', '/licence'];
    private browserOptions: InAppBrowserOptions = {
        hideurlbar: 'yes',
        toolbarcolor: this.global.COLOR_PRIMARY,
        usewkwebview: 'yes',
        zoom: 'no'
    };

    constructor(private nav: NavController,
                private browser: InAppBrowser,
                private storage: StorageService,
                private messageBus: MessageBusService,
                private global: GlobalService,
                private logger: LoggerService,
                private router: Router,
                private user: UserService) {}

    async initialize(menu: IonMenu): Promise<IHeaderDetail> {
        try {
            let canPop = this.router.url !== '/';
            if (canPop) {
                this.validHeaderUrls.forEach(x => {
                    if (this.router.url.startsWith(x)) {
                        canPop = false;
                    }
                });
            }
            this.mainMenu = menu;
            this.userDetails = await this.storage.get(Tables.UserDetails, null);
            let isLoggedIn = false;
            if (this.userDetails) {
                isLoggedIn = true;
            }
            return {
                CanPop: canPop,
                IsLoggedIn: isLoggedIn,
                UserDetail: this.userDetails,
                RouteWatcher: this.subscribeToRouting()
            };
        } catch (err) {
            this.logger.error('MainHeaderService::initialize', err);
        }
    }

    subscribeToRouting(): Observable<boolean> {
        return new Observable((sub: Subscriber<boolean>) => {
            this.router.events.subscribe((event: any) => {
                if (event.url) {
                    let hasValidMatch = false;
                    this.validHeaderUrls.forEach(x => {
                        if (event.url.startsWith(x)) {
                            hasValidMatch = true;
                        }
                    });
                    sub.next(!hasValidMatch);
                }
            });
        });
    }

    async getUserDetails(): Promise<IUserModel> {
        try {
            return await this.storage.get(Tables.UserDetails, null);
        } catch (err) {
            this.logger.error('MainHeaderService::getUserDetails', err);
        }
    }

    subscribeToLoginStatus(): Observable<any> {
        return this.messageBus.subscribeToUserLoginChange();
    }

    async closeMenu() {
        await this.mainMenu.close();
    }

    async openMenu() {
        await this.mainMenu.open();
    }

    async goBack() {
        await this.nav.pop();
    }

    async goToHistory() {
        await this.nav.navigateForward('/ar-form-history', { animated: true });
        await this.closeMenu();
    }

    async goToHome() {
        await this.nav.navigateRoot('dashboard', { animated: true });
    }

    async contactUs() {
        const browserInstance = this.browser.create('https://blog.wesbank.co.za/contacts/', '_blank', this.browserOptions);
        browserInstance.show();
        await this.closeMenu();
    }

    async aboutUs() {
        const browserInstance = this.browser.create('https://blog.wesbank.co.za/about-us/', '_blank', this.browserOptions);
        browserInstance.show();
        await this.closeMenu();
    }

    async privacy() {
        const browserInstance = this.browser.create('https://wesbank.co.za/wpautoterms/privacy-policy/', '_blank', this.browserOptions);
        browserInstance.show();
        await this.closeMenu();
    }

    async login() {
        await this.closeMenu();
        await this.global.modal(LoginSignupPage, null, 'small-popup');
    }

    async logOut() {
        try {
            await this.closeMenu();
            const result = await this.global.prompt('Are you sure you want to log out?');
            if (!result) {
                return;
            }

            this.user.LogOut();

             await this.storage.delete("storage_session");
            await this.storage.delete("storage_session");

            // await this.storage.delete(Tables.UserDetails);
            // await this.storage.delete(Tables.ARFormHistory);

            // const historyEntries = await this.storage.startsWith(Prefixes.ArFormHistoryDetail);
            // for (const startsWithResult of historyEntries) {
            //     await this.storage.delete(startsWithResult.Key);
            // }
            this.messageBus.sendMessageToUserLoginChangeMessageBus();
            //await this.global.toast('You have been logged out successfully.');
        } catch (err) {
            this.logger.error('MainHeaderService::logOut', err);
        }
    }
}

export interface IHeaderDetail {
    CanPop: boolean;
    IsLoggedIn: boolean;
    UserDetail: IUserModel;
    RouteWatcher: Observable<boolean>;
}
