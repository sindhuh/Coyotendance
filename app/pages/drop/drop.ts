import {Page, NavController, NavParams} from 'ionic-angular';
import {Backend} from '../../providers/backend/backend';
/*
  Generated class for the DropPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/drop/drop.html',
})
export class DropPage {
  constructor(public nav: NavController, public backend: Backend,  public navParams: NavParams) {
    
  }
  dropCourse() {
    this.backend.dropCourse(this.navParams.get("id")).then(function(){
      console.log("successfully dropped");
    });
  }
}
