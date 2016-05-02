import {Page, NavController} from 'ionic-angular';
import {Backend} from '../../providers/backend/backend';
import {AddCoursePage} from '../add-course/add-course'; 
import {CourseDetailsPage} from '../course-details/course-details';
import {CourseData} from '../../providers/course-data/course-data';

@Page({
  templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {
  courses: any[];
 
  constructor(public nav: NavController, courseData: CourseData, public backend : Backend) {
  /*  this.backend.loadCourses("").then(courses => {
      this.courses = courses;
    }) */
    
   this.nav = nav;
   courseData.load().then(function (data) {
      this.courses = data;
    });
  }
  addCourse() {
    this.nav.push(AddCoursePage);
  }
  viewCourse(course) {
    console.log("reaching here");
   this.nav.push(CourseDetailsPage, {course : course})
  }
}
