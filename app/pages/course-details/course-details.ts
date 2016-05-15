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
  enrolledStudents: any[] = [];
  professor: any;
  constructor(public nav: NavController, public backend: Backend, public navParams: NavParams) {
    this.course = {};
    this.professor = {};
  }

  editClass() {
    this.nav.push(AddCoursePage, { id: this.course._id });
  }
  
  onPageWillEnter() {
    if (this.navParams.get('id') != undefined) {
      this.backend.getCourse(this.navParams.get('id')).then(course => {
        this.course = course;
        var self = this;
        if (this.enrolledStudents.length == 0) {
          this.backend.getEnrolledStudents(this.course._id).then(enrolledStudents => {
            this.enrolledStudents = enrolledStudents;
          });
        }
        
        this.backend.getProfessor(self.course._id).then(professorData => {
          this.professor = professorData;
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
