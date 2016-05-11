import {Page, NavController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {SignupPage} from '../signup/signup';
/*
  Generated class for the AuthPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/auth/auth.html',
})
export class AuthPage {
  tab1Root: any = LoginPage;
  tab2Root: any =SignupPage;
  constructor(public nav: NavController) {
  }
  
}
