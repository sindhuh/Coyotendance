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
  selectedLocation:string;
  constructor(public nav: NavController, public backend: Backend, public navParams: NavParams) {
    this.course = {};
    this.course.professorID = this.backend.userDetails._id;
    this.course.students = [];
    this.backend.loadLocations().then(locations => {
      this.locations = locations;  
    });

    if (this.navParams.get('id') != undefined) {
      backend.getCourse(this.navParams.get('id')).then(course => {
        this.course = Object.assign({}, course);
      });
    }
  }
  
  updateClass() {
    let loading = Loading.create({
      content: 'Please wait...'
    });
    this.nav.present(loading);  
    var self = this;
    this.backend.updateCourse(this.course).then(function () {
      setTimeout(() => {
        loading.dismiss();
      }); 
      self.nav.pop(self);
    })
  }
}
