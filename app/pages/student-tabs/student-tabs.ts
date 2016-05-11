import {Page, NavController} from 'ionic-angular';
import {EnrolledCoursesPage} from "../enrolled-courses/enrolled-courses";
import {AvailableCoursesPage} from "../available-courses/available-courses"

@Page({
  templateUrl: 'build/pages/student-tabs/student-tabs.html',
})
export class StudentTabsPage {
  tab1Root: any = EnrolledCoursesPage;
  tab2Root: any = AvailableCoursesPage;
 
  constructor(public nav: NavController) {
    
  }
}
