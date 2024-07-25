import { Injectable, ErrorHandler } from '@angular/core';

import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { FirebaseCrashlytics } from '@ionic-native/firebase-crashlytics/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

@Injectable()
export class LoggerService implements ErrorHandler {

    private os = '';
    private make = '';
    private model = '';
    private osVersion = '';
    private RenaultVersion = '';
    private userId = '';

    constructor(private crashlytic: FirebaseCrashlytics,
                private analytics: FirebaseAnalytics,
                private device: Device,
                private appVersion: AppVersion) {}

    handleError(error: Error) {
        try {
            const errObject = {
                ErrorMessage: error.message,
                StackTrace: error.stack,
                ErrorType: error.name
            };
            this.error('EXCEPTION', errObject);
            console.log(error);
        } catch (err) {
            console.log(err);
        }
    }

    async initialize() {
        await (async () => {
            this.os = this.device.platform;
            this.make = this.device.manufacturer;
            this.model = this.device.model;
            this.osVersion = this.device.version;
            try {
                this.RenaultVersion = await this.appVersion.getVersionNumber();
            } catch {
                this.RenaultVersion = 'BROWSER';
            }

            this.crashlytic.initialise();
            this.analytics.setEnabled(true);
        })();
    }

    async setUserId(userId: string) {
        try {
            this.userId = userId;
            this.crashlytic.setUserIdentifier(this.userId);
            this.analytics.setUserId(this.userId);
        } catch (err) {
            this.error('LoggerService::setUserId', err);
        }
    }

    /**
     * Log an Error
     * @param pageName The name of Page where the Error ocured
     * @param errorMessage The actual Error Message
     */
    error(pageName: string, errorMessage: any | Error) {
        (async (page: string, message: any | Error) => {
            let errMessage: any = {};
            if (message instanceof Error) {
                errMessage = {
                    ErrorMessage: message.message,
                    StackTrace: message.stack,
                    ErrorType: message.name
                };
            } else {
                errMessage = message;
            }
            try {
                const report = await this.generateErrorReport({ PageIdentifier: page, LogMessage: errMessage });
                this.crashlytic.logException(report);
                console.log(JSON.parse(report));
            } catch (err) {
                this.info('ERROR_loggerservice_error', {
                    OriginalError: errMessage,
                    CaughtError: err
                });
                console.warn(err);
            }
        })(pageName, errorMessage);
    }

    /**
     * Log an Event
     * @param eventName The name of the Event to log (will convert spaces to _)
     * @param eventMessage The message to be logged with the event
     */
    info(eventName: string, eventMessage: any) {
        (async (event: string, message: any) => {
            try {
                while (event.indexOf(' ') > -1) {
                    event = event.replace(' ', '_');
                }
                const report = await this.generateInfoReport(message);
                this.analytics.logEvent(event, report);
            } catch (err) {
                console.warn('LoggerService Info Error', err);
            }
        })(eventName, eventMessage);
    }

    private async generateInfoReport(message: any): Promise<InfoReport> {
        if (!this.RenaultVersion) {
            await this.initialize();
        }
        return {
            Details: message,
            DeviceMake: this.make,
            DeviceModel: this.model,
            OS: this.os,
            AppVersion: this.RenaultVersion,
            OSVersion: this.osVersion,
            TimeStamp: new Date(),
            UserId: this.userId
        };
    }

    private async generateErrorReport(details: LogDetails): Promise<string> {
        if (!this.RenaultVersion) {
            await this.initialize();
        }
        const report: ErrorReport = {
            Details: details,
            DeviceMake: this.make,
            DeviceModel: this.model,
            OS: this.os,
            AppVersion: this.RenaultVersion,
            OSVersion: this.osVersion,
            TimeStamp: new Date(),
            UserId: this.userId
        };
        return JSON.stringify(report);
    }
}

interface InfoReport {
    OS: string;
    DeviceMake: string;
    DeviceModel: string;
    OSVersion: string;
    AppVersion: string;
    Details: any;
    UserId: string;
    TimeStamp: Date;
}

interface ErrorReport {
    OS: string;
    DeviceMake: string;
    DeviceModel: string;
    OSVersion: string;
    AppVersion: string;
    Details: LogDetails;
    UserId: string;
    TimeStamp: Date;
}

interface LogDetails {
    PageIdentifier: string;
    LogMessage: any;
}
