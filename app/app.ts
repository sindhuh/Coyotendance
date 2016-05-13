import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {AuthPage} from './pages/auth/auth';
import {Backend} from './providers/backend/backend';

@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [Backend]
})
export class MyApp {
  rootPage: any = AuthPage ;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
