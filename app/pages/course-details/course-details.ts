import {Page, NavParams, NavController} from 'ionic-angular';
import {AddCoursePage} from '../add-course/add-course';
import {Backend} from '../../providers/backend/backend';

/*
  Generated class for the CourseDetailsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/course-details/course-details.html',
})
export class CourseDetailsPage {
  course: any;
  constructor(public nav: NavController, public backend: Backend, public navParams: NavParams) {
    this.course = {};
    if(this.navParams.get('id') != undefined) {
      backend.getCourse(this.navParams.get('id')).then(course => {
        this.course = course;
      });
    }   
  }
  
  editClass() {
    this.nav.push(AddCoursePage, {id: this.course._id});
  }
}
