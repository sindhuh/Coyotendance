import {Page} from 'ionic-angular';
import {Backend} from '../../providers/backend/backend'; 

@Page({
  templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {
  courses: any[];
  
  constructor(public backend : Backend) {
    this.backend.loadCourses("").then(courses => {
      this.courses = courses;
    })
  }
}
