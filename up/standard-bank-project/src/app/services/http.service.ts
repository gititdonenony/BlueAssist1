import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent } from '@angular/common/http';

import { AlertController, LoadingController } from '@ionic/angular';

import { StorageService } from '../services/storage.service';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class HttpService {
    // baseURL = 'http://localhost:54935';
    baseURL = 'https://7cp7krix31.execute-api.eu-west-1.amazonaws.com/live';
    apiKey = 'uGN92LRPy8agZSjnUA2YLcsGZ18XTMr30sISRbBe';

    constructor(private http: HttpClient,
                private storage: StorageService,
                private alertC: AlertController,
                private loading: LoadingController,
                private logger: LoggerService) {
        if (!isDevMode()) {
            this.baseURL = 'https://7cp7krix31.execute-api.eu-west-1.amazonaws.com/live';
        }
    }

    private async createHTTPLoading() {
        const load = await this.loading.create({
            animated: true,
            backdropDismiss: false,
            mode: 'ios',
            message: 'Please wait...',
            spinner: 'crescent'
        });
        await load.present();
        return load;
    }

    get(url: string, parms: {} = null, loadingText?: boolean) {
        return new Promise(async (resolve, reject) => {
            let request = this.baseURL + url;
            if (parms != null && Object.keys(parms).length > 0) {
                request += '?';
                for (const key in parms) {
                    if (parms[key]) {
                        if (!request.endsWith('?') && !request.endsWith('&')) {
                            request += '&';
                        }
                        request += key + '=' + encodeURIComponent(parms[key]);
                    }
                }
            }

            let load: HTMLIonLoadingElement;
            if (loadingText) {
                load = await this.createHTTPLoading();
            }
            const subscription = this.http.get(request, { headers: new HttpHeaders(this.getAuthHeaders()) }).subscribe(async (data) => {
                if (loadingText && load) {
                    await load.dismiss();
                }
                resolve(data);
                subscription.unsubscribe();
            }, async (err: HttpErrorResponse) => {
                if (loadingText && load) {
                    await load.dismiss();
                }
                this.logger.error('HttpService::get', err);
                reject();
                subscription.unsubscribe();
            });
        });
    }

    post(url: string, parms: any, isStringResponse?: boolean, progressChanged?: (progress: any) => void) {
        return new Promise(async (resolve, reject) => {
            const subscription = this.http.post(this.baseURL + url,
                            JSON.stringify(parms),
                            {
                                headers: new HttpHeaders(this.getAuthHeaders()),
                                reportProgress: true,
                                observe: 'events',
                                // responseType: responseT
                            }
                            ).subscribe(async (data: any) => {
                if (progressChanged) {
                    progressChanged(data);
                }
                if (data.type === 4) {
                    resolve(data.body ? data.body : data);
                    subscription.unsubscribe();
                }
            }, (err: HttpErrorResponse) => {
                this.logger.error('HttpService::post', err);
                reject(err);
                subscription.unsubscribe();
            });
        });
    }

    put(url: string, parms: any, progressChanged?: (progress: any) => void) {
        return new Promise(async (resolve, reject) => {
            this.http.put(this.baseURL + url,
                            JSON.stringify(parms),
                            {
                                headers: new HttpHeaders(this.getAuthHeaders()),
                                reportProgress: true,
                                observe: 'events'
                            }
                            ).subscribe(async (data: any) => {
                if (progressChanged) {
                    progressChanged(data);
                }
                if (data.type === 4) {
                    resolve(data.body ? data.body : data);
                }
            }, async (err: HttpErrorResponse) => {
                this.logger.error('HttpService::put', err);
                reject(err);
            });
        });
    }

    absoluteURL() {
        return new URL(this.baseURL).origin;
    }

    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            accept: 'application/json',
            'x-api-key': this.apiKey
        };
    }
}
