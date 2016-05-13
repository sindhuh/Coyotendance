import {Page, Toast, NavController, Loading} from 'ionic-angular';
import {Backend} from '../../providers/backend/backend';
import {TabsPage} from "../tabs/tabs";
import {StudentTabsPage} from "../student-tabs/student-tabs";
import {Observable} from 'rxjs/Observable';


@Page({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
  email: any;
  password: any;
  token: any;
  userObject: any;
  constructor(public nav: NavController, public backend: Backend) {
    this.nav = nav;
    this.email = "";
    this.password = "";
    this.isLoggedIn();
  }
  isLoggedIn() {
    if (localStorage.getItem('email')) {
      if (this.backend.userDetails.isProfessor) {
        this.nav.push(TabsPage);
      } else {
        this.nav.push(StudentTabsPage);
      }
    }
  }

  validateUser() {
    var user = {
      email: this.email,
      password: this.password
    }
    if (!this.email || !this.password) {
      let toast = Toast.create({
        message: 'Please enter valid details',
        duration: 3000
      });
      this.nav.present(toast);
      return false;
    }
    let loading = Loading.create({
      content: 'Please wait...'
    });
    this.nav.present(loading);
    var self = this;
    this.backend.loginUser(user).then(function () {
      localStorage.setItem('email', user.email);
      setTimeout(() => {
        loading.dismiss();
      });
      if (self.backend.userDetails.isProfessor) {
        self.nav.push(TabsPage);
      } else {
        self.nav.push(StudentTabsPage);
      }
    }).catch(function() {
      console.log("error invalid user");
    })
  }
}
