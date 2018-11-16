import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Network } from '@ionic-native/network';
import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage {
  locs: any;
  loc: any;
  connectSubscription: any;
  date_scan: String;
  inv_scan: any;
  public invItems = []
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public restProvider: RestProvider,
    public network: Network,
    public storage: Storage,
    public toast: Toast,
    public barcode: BarcodeScanner,
  ) {
    this.getLocalLoc();
    this.getLocalInv();
  }

  ionViewDidLoad() {
    this.getLocalInv();
    this.getLocalLoc();

  }

  getLocalLoc() {
    this.storage.get('fu_scanner_locations').then((local_locs) => {
      if (local_locs != null) {
        console.log('getting all locations from local storage...');
        console.log('Total: ' + local_locs.length);
        this.locs = local_locs;
      } else {
        this.locs = [];
      }
    });
  }

  listInv() {
    if (this.loc == null) {
      this.toast.show(`Select location first`, '2000', 'center').subscribe(toast => { toast });
      this.inv_scan = '';
    } else {
      this.date_scan = new Date().toLocaleString();
      let invItem = {
        inv_scan: this.inv_scan.trim() + ':' + this.loc + ':' + this.date_scan
      };
      this.invItems.push(invItem);
      this.storage.set('inventory', this.invItems);
      this.inv_scan = '';
    }
  }
  
  getLocalInv() {
    this.storage.get('inventory').then((invItems) => {
      if (invItems != null) {
        console.log('getting all inventory from local storage...');
        console.log('Total: ' + invItems.length);
        for (let invItem of invItems) {
          console.log(JSON.stringify(invItem));
          this.invItems.push(invItem);
        }
      } else {
        this.invItems = [];
      }
    });
  }

  isNetworkAvailable() {
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      setTimeout(() => {
      }, 3000);
    });
  }

  invUpload() {
    this.isNetworkAvailable();
    if (this.network.type === 'none') {
      this.toast.show(`No Network Available`, '2000', 'center').subscribe(toast => {toast});
    } else {
      for (let invItem of this.invItems) {
        console.log('uploading: ' + JSON.stringify(invItem));
        this.reupload(invItem);
        console.log(this.invItems.length);
      } console.log('Upload Complete!');
      this.toast.show(`Upload Complete!`, '2000', 'center').subscribe(toast => {toast});
      this.clearLocalData();
    } this.connectSubscription.unsubscribe();
  }

  reupload(inv_scan) {
      this.restProvider.addInventory(inv_scan).then((result) => {
      }, (err) => {
        console.log(JSON.stringify(err));
      });
  }

  clearLocalData() {
    this.storage.remove('inventory').then(() => {
      console.log('Storage Removed!');
    });
    this.getLocalInv();
  }

  openCamera(){
    this.barcode.scan({showTorchButton:true}).then(barcodeData => {
      console.log('Barcode data: ', barcodeData);
      if (barcodeData.cancelled) {
        this.inv_scan = '';  
      }else {
        this.inv_scan = barcodeData.text;
        this.listInv();
      }
     }).catch(err => {
         console.log('Error', err);
     });
  }
}
