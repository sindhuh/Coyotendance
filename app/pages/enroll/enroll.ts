import {Page, NavController, NavParams} from 'ionic-angular';
import {Backend} from '../../providers/backend/backend';
/*
  Generated class for the EnrollPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/enroll/enroll.html',
})
export class EnrollPage {
  constructor(public nav: NavController, public navParams: NavParams, public backend: Backend) {
    
  }
  enrollCourse() {
    this.backend.enrollCourse(this.navParams.get("id")).then(function(){
      console.log("successfully enrolled");
    });
  }
}
