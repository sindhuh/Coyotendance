import {Page, NavController, NavParams, Loading} from 'ionic-angular';
import {Backend} from '../../providers/backend/backend';
/*
  Generated class for the AddCoursePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/add-course/add-course.html',
})
export class AddCoursePage {
  course: any;
  locations: any;
  constructor(public nav: NavController, public backend: Backend, public navParams: NavParams) {
    this.course = {};
    if (this.navParams.get('id') != undefined) {
      backend.getCourse(this.navParams.get('id')).then(course => {
        this.course = Object.assign({}, course);
      });
    }
    // this.backend.loadCourselist().then(list => {
    //   this.locations = list;
    //  }) ;
    //console.log(">>>> locations list" +this.backend.loadCourselist());
    // this.locations = [{"id": 1}, {"id" : 2}]
  }

  updateClass() {
    console.log("reaching here");
    // show loading spinner.
    let loading = Loading.create({
      content: 'Please wait...'
    });
    this.nav.present(loading);

    var self = this;
    this.backend.updateCourse(this.course).then(function () {
      // hide loading spinner.
      setTimeout(() => {
        loading.dismiss();
      }); 
      self.nav.pop(self);
    })
  }
}
