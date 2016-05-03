import {Page, NavController} from 'ionic-angular';
import {Backend} from '../../providers/backend/backend';
import {AddCoursePage} from '../add-course/add-course';
import {CourseDetailsPage} from '../course-details/course-details';

@Page({
  templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {
  courses: any[];

  constructor(public nav: NavController, public backend: Backend) {
    this.backend.loadCourses("").then(courses => {
      this.courses = courses;
    })
    this.nav = nav;
  }
  
  addCourse() {
    this.nav.push(AddCoursePage);
  }
  
  viewCourse(course) {
    this.nav.push(CourseDetailsPage, { id: course._id })
  }
  
  deleteCourse(course){
    console.log("viewCourse(course)");
    this.backend.deleteCourse(course._id);
  }
}
  