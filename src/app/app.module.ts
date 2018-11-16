import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { Keyboard } from '@ionic-native/keyboard'
import { IonicStorageModule } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MyApp } from './app.component';

import { UnitsPage } from '../pages/units/units';
import { InventoryPage } from '../pages/inventory/inventory';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { RestProvider } from '../providers/rest/rest';

@NgModule({
  declarations: [
    MyApp,
    UnitsPage,
    InventoryPage,
    HomePage,
    SettingsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    UnitsPage,
    InventoryPage,
    HomePage,
    SettingsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    Network,
    Toast,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider
  ]
})
export class AppModule {}
