import { Component } from '@angular/core';

import { InventoryPage } from '../inventory/inventory';
import { UnitsPage } from '../units/units';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = InventoryPage;
  tab3Root = UnitsPage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
