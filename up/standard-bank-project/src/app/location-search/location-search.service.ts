import { Injectable } from '@angular/core';

import { StorageService, Tables } from 'src/app/services/storage.service';
import { GlobalService } from 'src/app/services/global.service';
import { ILocationInformation } from 'src/app/services/models.service';
import { LoggerService } from 'src/app/services/logger.service';
import { MessageBusService } from 'src/app/services/messagebus.service';

import { Geocoder, GeocoderResult, ILatLng, GoogleMaps, Environment } from '@ionic-native/google-maps/ngx';
import { Geoposition } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs';

declare const google;

@Injectable()
export class LocationService {

    existingSaveLocation: ILocationInformation;

    autoCompleteService: any; // typeof google.maps.places.AutocompleteService

    constructor(private storage: StorageService,
                private global: GlobalService,
                private logger: LoggerService,
                private messageBus: MessageBusService) { }

    async initialize(): Promise<string> {
        try {
            if (GoogleMaps.getPlugin()) {
                Environment.setEnv({
                    API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyCYjTsxPiBIs5SyippviUnWw-Dn5meAtpY',
                    API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyCYjTsxPiBIs5SyippviUnWw-Dn5meAtpY'
                });
            }

            this.autoCompleteService = new google.maps.places.AutocompleteService();

            const locationInfo = await this.storage.getInstance<ILocationInformation>(Tables.LocationInformation);
            if (locationInfo) {
                this.existingSaveLocation = locationInfo;
                if (this.existingSaveLocation.Address) {
                    return this.existingSaveLocation.Address;
                }
            }

            return '';
        } catch (err) {
            this.logger.error('LocationService::initialize', err);
        }
    }

    subscribeToLocationPrompt(): Observable<any> {
        return this.messageBus.subscribeToLocationPromptMessageBus();
    }

    async getCurrentLocation(): Promise<string> {
        try {
            const location = await this.global.getLocation();
            if (location) {
                if (this.existingSaveLocation && this.existingSaveLocation.Address) {
                    const distanceBetweenPoints = this.getDistanceBetweenCoordinates(
                        location.coords.latitude,
                        location.coords.longitude,
                        this.existingSaveLocation.Lat,
                        this.existingSaveLocation.Lon);
                    if (distanceBetweenPoints <= 50) {
                        return '';
                    }
                }
                return (await this.getCurrentGeoCode(this.toILatLong(location)));
            }
            return '';
        } catch (err) {
            this.logger.error('LocationService::getCurrentLocation', err);
        }
    }

    async shareLocation() {
        if (!this.existingSaveLocation || !this.existingSaveLocation.ShareableMap) {
            await this.global.toast('Please enter your location or click the location button on the left.');
            return;
        }

        const message = encodeURIComponent(`*I was in an accident @ ${this.existingSaveLocation.Address}!*\n\nHere is my location: ${this.existingSaveLocation.ShareableMap}`);

        this.global.actionSheet('Share your location', [
            {
                icon: 'logo-whatsapp',
                text: 'Whatsapp',
                handler: () => {
                    window.open('whatsapp://send?text=' + message, '_system', 'location=yes');
                    this.logger.info('share', {
                        ShareType: 'Location over Whatsapp'
                    });
                }
            },
            {
                icon: 'chatbox',
                text: 'Message',
                handler: () => {
                    window.open('sms://?body=' + message, '_system', 'location=yes');
                    this.logger.info('share', {
                        ShareType: 'Location over Message'
                    });
                }
            },
            {
                icon: 'close',
                text: 'Cancel',
                role: 'cancel'
            }
        ]);
    }

    autoCompleteLocation(location: string): Promise<AutoCompleteSuggestion[]> {
        return new Promise((resolve) => {
            if (this.existingSaveLocation && this.existingSaveLocation.Address === location) {
                resolve([]);
                return;
            }
            try {
                this.autoCompleteService.getPlacePredictions({
                    input: location,
                    componentRestrictions: { country: 'za' }
                }, (results: any) => { // typeof google.maps.places.AutocompletePrediction[]
                    if (!results) {
                        resolve([]);
                        return;
                    }
                    const suggestions = [];
                    for (let i = 0; i < results.length && i < 8; i++) {
                        suggestions.push({ Address: results[i].description.replace(', South Africa', ''), PlaceId: results[i].place_id });
                    }
                    resolve(suggestions);
                });
            } catch (err) {
                this.logger.error('LocationService::autoCompleteLocation', err);
                resolve([]);
            }
        });
    }

    selectAutoComplete(autoCompleteResult: AutoCompleteSuggestion): Promise<string> {
        return new Promise((resolve) => {
            Geocoder.geocode({ address: autoCompleteResult.Address }).then(async (results: GeocoderResult[]) => {
                const address = await this.buildAddressFormGeoCoderResults(results, null);
                resolve(address);
            }).catch(err => {
                this.logger.error('LocationService::selectAutoComplete', err);
                resolve('');
            });
        });
    }

    private async buildAddressFormGeoCoderResults(geoCoderResults: GeocoderResult[], currentPos: ILatLng): Promise<string> {
        try {
            const compareResults = [];
            if (currentPos) {
                for (const result of geoCoderResults) {
                    const latDiff = Math.abs(currentPos.lat - result.position.lat);
                    const lonDiff = Math.abs(currentPos.lng - result.position.lng);
                    compareResults.push({ Geocode: result, Diff: latDiff + lonDiff });
                }
            } else {
                compareResults.push(geoCoderResults[0]);
            }

            const currentLoc: GeocoderResult = compareResults[0].Geocode ? compareResults[0].Geocode : compareResults[0];

            if (!currentPos) {
                currentPos = currentLoc.position;
            }

            let address = '';
            if (currentLoc.extra['types'] && currentLoc.extra['types'].indexOf('street_address') > -1) {
                address += `${currentLoc.extra.lines[0]} ${currentLoc.extra.lines[1]}, `;
                address += currentLoc.extra.lines[2] + ', ';
                address += currentLoc.extra.lines[3] + ', ';
                address += currentLoc.extra.lines[5];
            } else if (currentLoc.extra['types'] && currentLoc.extra['types'].indexOf('route') > -1) {
                address += `${currentLoc.extra.lines[0]}, `;
                address += `${currentLoc.locality}, `;
                address += `${currentLoc.subAdminArea}, `;
                address += `${currentLoc.adminArea}`;
            } else if (currentLoc.extra['types'] && currentLoc.extra['types'].indexOf('sublocality') > -1) {
                address += `${currentLoc.subLocality}, `;
                address += `${currentLoc.locality}, `;
                address += `${currentLoc.adminArea}`;
            } else {
                for (const line of currentLoc.extra.lines) {
                    address += `${line} `;
                }
            }

            const locationInformation: ILocationInformation = {
                Lat: currentPos.lat,
                Lon: currentPos.lng,
                Address: address,
                LocationObject: currentLoc,
                ShareableMap: `https://www.google.com/maps/search/?api=1&query=${currentPos.lat},${currentPos.lng}`
            };

            await this.storage.set(Tables.LocationInformation, locationInformation);
            this.existingSaveLocation = locationInformation;
            (async (locInfo) => {
                await this.setLocationInfoOnArForm(locInfo);
            })(locationInformation);

            return address;
        } catch (err) {
            this.logger.error('LocationService::buildAddressFormGeoCoderResults', err);
        }
    }

    private async setLocationInfoOnArForm(locationInformation: ILocationInformation) {
        try {
            const infoToSave = {};
            const province = locationInformation.LocationObject.adminArea ? locationInformation.LocationObject.adminArea.toLowerCase() : '';
            const provinceId = this.getProvinceId(province);
            if (provinceId > 0) {
                infoToSave[7] = provinceId;
            }
            infoToSave[8] = locationInformation.Address;
            infoToSave[24] = locationInformation.Lat;
            infoToSave[25] = locationInformation.Lon;

            await this.storage.insertBulkARFormInputs(infoToSave);
        } catch (err) {
            this.logger.error('LocationService::setLocationInfoOnArForm', err);
        }
    }
    private getProvinceId(provinceName: string) {
        let provinceId = 0;
        if (provinceName.indexOf('east') > -1) {
            provinceId = 1;
        } else if (provinceName.indexOf('state') > -1) {
            provinceId = 2;
        } else if (provinceName.indexOf('gau') > -1) {
            provinceId = 3;
        } else if (provinceName.indexOf('kwa') > -1) {
            provinceId = 4;
        } else if (provinceName.indexOf('mpuma') > -1) {
            provinceId = 5;
        } else if (provinceName.indexOf('west') > -1) {
            provinceId = 6;
        } else if (provinceName.indexOf('north') > -1 && provinceName.indexOf('cape') > -1) {
            provinceId = 7;
        } else if (provinceName.indexOf('limpo') > -1) {
            provinceId = 8;
        } else if (provinceName.indexOf('west') > -1 && provinceName.indexOf('cape') > -1) {
            provinceId = 9;
        }
        return provinceId;
    }

    public toILatLong(pos: Geoposition): ILatLng {
        return {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };
    }

    private getDistanceBetweenCoordinates(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const deg2rad = (deg) => {
            return deg * (Math.PI / 180);
        };

        const R = 6371000; // Radius of the earth in meters
        const dLat = deg2rad(lat2 - lat1);  // deg2rad below
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in meters
        return d;
    }

    private getCurrentGeoCode(pos: ILatLng): Promise<string> {
        return new Promise((resolve) => {
            Geocoder.geocode({ position: { lat: pos.lat, lng: pos.lng } }).then(async (results: GeocoderResult[]) => {
                const address = await this.buildAddressFormGeoCoderResults(results, pos);
                resolve(address);
            }).catch((err) => {
                this.logger.error('LocationService::getCurrentGeoCode', err);
                this.global.toast('Could not retrieve full location');
                resolve("");
            });
        });
    }

    public CurrentGeoCode(pos: ILatLng): Promise<string> {
        return new Promise((resolve) => {
            Geocoder.geocode({ position: { lat: pos.lat, lng: pos.lng } }).then(async (results: GeocoderResult[]) => {
                const address = await this.buildAddressFormGeoCoderResults(results, pos);
                resolve(address);
            }).catch((err) => {
                resolve("");
            });
        });
    }
}

export interface AutoCompleteSuggestion {
    Address: string;
    PlaceId: string;
}
