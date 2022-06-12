import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  activePageTitle = 'Dag';
  Pages = [
    {
      title: 'Dag',
      url: '/tabs/tab0',
      icon: 'bonfire'
    },
    {
      title: 'Vlag',
      url: '/tabs/tab1',
      icon: 'people'
    },
    {
      title: 'Botters',
      url: '/tabs/tab2',
      icon: 'boat'
    },
    {
      title: 'Overzicht',
      url: '/tabs/tab3',
      icon: 'pulse'
    }
  ];
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
  ) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
