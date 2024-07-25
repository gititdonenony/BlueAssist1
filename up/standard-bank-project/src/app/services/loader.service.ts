import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import {Platform } from '@ionic/angular';


@Injectable({
	providedIn: 'root'
})

export class LoaderService {
	subscription: any;

	
	constructor(public loadingController: LoadingController,
		        private platform: Platform,) {}

	showHideAutoLoader() {
		this.loadingController.create({
			spinner: 'crescent',
			message: 'This Loader Will Auto Hide in 2 Seconds',
			duration: 2000
		}).then((res) => {
			res.present();
			res.onDidDismiss().then((dis) => {
				console.log('Loading dismissed! after 2 Seconds', dis);
			});
		});

	}

	showLoader() {
		// for diasble hardware back button
		this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
			// do nothing
		  });
		this.loadingController.create({
			 spinner: 'crescent',
			 backdropDismiss: true,
		}).then((res) => {
			res.present();
			res.onDidDismiss().then(dis => {
				console.log('showLoader Loading dismissed!', dis);
			});
		});
	}

	// Hide the loader if already created otherwise return error
	async hideLoader() {
		const loader = await this.loadingController.dismiss().then((res) => {
			console.log('hideLoader Loading dismissed!', res);
			// enable the hardware back button
			this.subscription.unsubscribe();
		}).catch((error) => {
			console.log('error', error);
			this.subscription.unsubscribe();
		});
	}
}
