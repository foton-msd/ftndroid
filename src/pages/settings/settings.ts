import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {
    locs: any;
    loc: any;
    connectSubscription: any;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public restProvider: RestProvider,
        public storage: Storage,
        public toast: Toast
    ) {
    }

    defaultAction() {
        this.toast.show('Coming Soon!', '2000', 'center').subscribe(toast => {toast});
    }

    quickInfo() {
        this.toast.show('AMSMobile-v.0.0.4', '2000', 'center').subscribe(toast => {toast});
    }

    getLocations() {
        this.restProvider.getLocations()
            .then(data => {
                this.locs = data;
                this.storage.set('fu_scanner_locations', this.locs);
            });
        this.getLocalLoc();
    }

    getLocalLoc() {
        this.storage.get('fu_scanner_locations').then((locItems) => {
            if (locItems != null) {
                console.log('getting all locations from local storage...');
                console.log('Total: ' + locItems.length);
                for (let locItem of locItems) {
                    console.log(JSON.stringify(locItem));
                    //this.newItems.push(errItem);
                }
                this.toast.show(`Location Updated!`, '2000', 'center').subscribe(
                    toast => {
                        console.log(toast);
                    }
                );
            } else {
                //this.newItems = [];
            }
        });
    }
}
