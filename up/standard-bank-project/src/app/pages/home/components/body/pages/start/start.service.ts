import { Injectable } from '@angular/core';

import { NavController } from '@ionic/angular';

import { GlobalService } from '../../../../../../services/global.service';
import { StorageService, Prefixes, Tables } from '../../../../../../services/storage.service';
import { FormBuilderService } from '../../../../../../services/formbuilder.service';
import { LoggerService } from '../../../../../../services/logger.service';
import { IArFormHistory } from '../../../../../../services/models.service';
import { MessageBusService } from '../../../../../../services/messagebus.service';
import { Observable } from 'rxjs';


@Injectable()
export class StartService {

    constructor(private global: GlobalService,
                private nav: NavController,
                private storage: StorageService,
                private formBuilder: FormBuilderService,
                private logger: LoggerService,
                private messageBus: MessageBusService) {}

    /**
     * Initialzes all the data
     */
    async initialize(): Promise<boolean> {
        const currentStates = await this.storage.startsWith(Prefixes.PageButtonStates);
        if (currentStates && currentStates.length > 0) {
            return true;
        }
        return false;
    }

    /**
     * Deletes the currently active AR Form and refreshes the data
     */
    async deleteActiveForm(): Promise<boolean> {
        const result = await this.global.prompt('<strong>ARE YOU SURE?</strong><br /><br />If you delete this form, all the information that you captured will be lost and cannot be recovered.');
        if (!result) {
            return false;
        }
        await this.formBuilder.deleteCurrentForm();
        return true;
    }

    /**
     * Continue the currently active AR Form
     */
    async continueForm() {
        await this.nav.navigateForward('/home/accident', { animated: true });
    }

    /**
     * If there is an existing form, the existing form will be deleted, and "continueForm()" will be called
     * @param hasExisting Has an existing active AR Form
     */
    async startNewForm(hasExisting: boolean): Promise<boolean> {
        if (!hasExisting) {
            await this.continueForm();
            this.messageBus.promptLocation();
            return false;
        } else {
            const result = await this.global.prompt('<strong>ARE YOU SURE?</strong><br /><br />If you start a new form, all the information that you captured will be lost and cannot be recovered.');
            if (!result) {
                return false;
            }
            await this.formBuilder.deleteCurrentForm();
            await this.continueForm();
            this.messageBus.promptLocation();
            return true;
        }
    }

    /**
     * Navigates to the AR Form History Page
     */
    async goToHistory() {
        await this.nav.navigateForward('/ar-form-history', { animated: true });
    }

    /**
     * Retrieves the history count from storage
     */
    async getHistoryCount() {
        try {
            const history: IArFormHistory[] = await this.storage.get(Tables.ARFormHistory, []);
            return history.length;
        } catch (err) {
            this.logger.error('StartService::getHistoryCount', err);
        }
    }

    /**
     * Toggles the Emergency Footer
     */
    toggleEmergencyFooter() {
        this.messageBus.toggleEmergency();
    }

    /**
     * Subscribing to the Keyboard Open and Close Events
     */
    subscribeToKeyboard(): Observable<boolean> {
        return this.messageBus.subscribeToKeyboardToggle();
    }
}
