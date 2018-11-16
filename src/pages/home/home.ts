import { Component, ViewChild } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild('scan') myScan;
  date_scan: String;
  foton_number: any;
  scan_type: any;
  locs: any;
  loc: any;
  len: any;
  connectSubscription: any;
  isForUpdate: boolean;
  public errItems = []
  public newItems = []
  public dbItems = []
  public inputs = []


  constructor(private alertCtrl: AlertController,
    public vc: ViewController,
    public restProvider: RestProvider,
    private storage: Storage,
    private toast: Toast,
    private network: Network,
    private barcode: BarcodeScanner,
  ) {
    this.getLocalLoc();
    this.isForUpdate = false;
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Scan as',
      inputs: [
        { type: 'radio', label: 'Incoming', value: 'INC' },
        { type: 'radio', label: 'Outgoing', value: 'OUT' }
      ],
      buttons: [
        {
          text: 'Cancel', role: 'cancel', handler: () => {
            this.foton_number = '';
          }
        },
        {
          text: 'Confirm', handler: (data: string) => {
            if (data != null) {
              this.scan_type = data;
              if (this.loc == null) {
                this.confirmLocation();
                console.log(this.loc);
              } else {
                this.saveUser();
              }
            } else {
              this.foton_number = '';
            }
          }
        }
      ]
    });
    alert.present();
  }

  confirmLocation() {
    for (let loc of this.locs) {
      let input = { type: 'radio', label: loc.loc_name, value: loc.loc_code }
      this.inputs.push(input);
    }
    let alert = this.alertCtrl.create({
      title: 'Set Location to',
      inputs: this.inputs,
      buttons: [
        {
          text: 'Cancel', role: 'cancel', handler: () => {
            this.foton_number = '';
          }
        },
        {
          text: 'Confirm', handler: (data: string) => {
            if (data != null) {
              this.loc = data;
              this.saveUser();
            } else {
              this.foton_number = '';
            }
          }
        }
      ]
    });
    alert.present();
  }

  isNetworkAvailable() {
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      setTimeout(() => {
      }, 3000);
    });
  }

  ionViewDidLoad() {
    this.getLocalData(); 
    this.getLocalLoc();
    setTimeout(() => {
      this.myScan.setFocus();
    }, 150);
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

  getLocalData() {
    this.storage.get('scan_item').then((errItems) => {
      if (errItems != null) {
        this.isForUpdate = true;
        console.log('getting all scan_item from local storage...');
        console.log('Total: ' + errItems.length);
        for (let errItem of errItems) {
          console.log(JSON.stringify(errItem));
          this.newItems.push(errItem);
        }
        this.isForUpdate = false;
      } else {
        this.newItems = [];
      }
    });
  }

  clearLocalData() {
    this.storage.remove('scan_item').then(() => {
      console.log('Storage Removed!');
    });
    this.getLocalData();
  }

  saveItem() {
    let newItem = {
      scan_item: this.foton_number + ':' + this.scan_type + ':' + this.loc
    };
    console.log(JSON.stringify(newItem));
    this.newItems.push(newItem);
    this.foton_number = '';
  }

  saveItemErr() {
    this.date_scan = new Date().toLocaleString();
    let newItem = {
      scan_item: this.foton_number.trim() + ':' + this.scan_type + ':' + this.loc + ':' + this.date_scan + ':' + 'err'
    };
    console.log('saveItemErr:' + this.foton_number);
    this.newItems.push(newItem);
    this.storage.set('scan_item', this.newItems);
    this.foton_number = '';
    this.isForUpdate = true;
  }

  saveUser() {
    this.date_scan = new Date().toLocaleString();
    this.restProvider.scanFMPI({ scan_item: this.foton_number.trim() + ':' + this.scan_type + ':' + this.loc + ':' + this.date_scan }).then((result) => {
      console.log('result:' + result);
      this.saveItem();
      this.forceFocus();
    }, (err) => {
      console.log('error: ' + JSON.stringify(err));
      this.saveItemErr();
      this.forceFocus();
    });
  }

  forceFocus() {
    setTimeout(() => {
      this.myScan.setFocus();
    }, 150);
  }

  retryUpload() {
    this.isNetworkAvailable();
    if (this.network.type === 'none') {
      console.log('No network available');
      this.toast.show(`No Network Available`, '2000', 'center').subscribe(toast => { toast });
    } else {
      for (let newItem of this.newItems) {
        console.log('uploading: ' + JSON.stringify(newItem));
        this.reupload(newItem);
        console.log(this.newItems.length);
      } console.log('Upload Complete!');
      this.toast.show(`Upload Complete!`, '2000', 'center').subscribe(toast => { toast });
      this.clearLocalData();
    } this.connectSubscription.unsubscribe();
  }

  reupload(scan_item) {
    let item = JSON.stringify(scan_item);
    if (item.slice(-5) == 'err"}') {
      this.restProvider.scanFMPI(scan_item).then((result) => {
      }, (err) => {
        console.log(JSON.stringify(err));
      });
    }
  }

  openCamera() {
    this.barcode.scan({showTorchButton:true}).then(barcodeData => {
      console.log('Barcode data: ', barcodeData);
      if (barcodeData.cancelled) {
        this.foton_number = '';
      } else {
        this.foton_number = barcodeData.text;
        this.presentConfirm();
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }
}

