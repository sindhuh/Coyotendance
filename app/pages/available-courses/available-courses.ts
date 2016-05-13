import {Page, ActionSheet, Platform, Alert, NavController} from 'ionic-angular';
import {Backend} from '../../providers/backend/backend';
import {EnrollPage} from "../enroll/enroll";
import {CourseDetailsPage} from "../course-details/course-details"
@Page({
  templateUrl: 'build/pages/available-courses/available-courses.html',
})
export class AvailableCoursesPage {
  availableCourses: any[];
  constructor(public nav: NavController, public backend: Backend, public platform: Platform) {
    this.backend.availableCourses(backend.userDetails._id)
      .then(enrolledCourses => {
        this.availableCourses = enrolledCourses;
      });
  }
  viewCourse(course) {
    this.nav.push(CourseDetailsPage, { id: course._id })
  }
  enrollCourse(course) {
    var enrollPrompt = Alert.create({
      title: 'Enroll Course',
      message: "Do you want to enroll this course?",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked', data);
          }
        },
        {
          text: 'Enroll',
          handler: data => {
            this.backend.enrollCourse(course._id).then(function () {
              console.log("successfully enrolled");
            });
          }
        }
      ]
    });
    this.nav.present(enrollPrompt);
  }
  openMenu(course) {
    let actionSheet = ActionSheet.create({
      title: 'Options',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Enroll',
          icon: !this.platform.is('ios') ? 'add' : null,
          handler: () => {
            this.enrollCourse(course);
          }
        },
        {
          text: 'View',
          icon: !this.platform.is('ios') ? 'eye' : null,
          handler: () => {
            this.viewCourse(course);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
          }
        }
      ]
    });
     this.nav.present(actionSheet);
  }
}
