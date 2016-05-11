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
  enrolledStudents : any[]
  constructor(public nav: NavController, public backend: Backend, public navParams: NavParams) {
    this.course = {}; 
  }
  
  editClass() {
    this.nav.push(AddCoursePage, {id: this.course._id});
  }
  onPageWillEnter() {
    if(this.navParams.get('id') != undefined) {
      this.backend.getCourse(this.navParams.get('id')).then(course => {
        this.course = course;
      this.backend.getEnrolledStudents(this.course.students).then(enrolledStudents => {
          this.enrolledStudents = enrolledStudents;
          console.log("ikkadena :" ,this.enrolledStudents);
        })
      }); 
    }                       
  }
 /* onPageLoaded
  onPageWillEnter
  onPageDidEnter
  onPageWillLeave 
  onPageDidLeave 
  onPageWillUnload
  onPageDidUnload */
}
