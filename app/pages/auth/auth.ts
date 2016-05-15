import {Page, NavController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {SignupPage} from '../signup/signup';

@Page({
  templateUrl: 'build/pages/auth/auth.html',
})
export class AuthPage {
  tab1Root: any = LoginPage;
  tab2Root: any =SignupPage;
  constructor(public nav: NavController) {
  }
  
}
