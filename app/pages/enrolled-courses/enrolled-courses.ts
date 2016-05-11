import {Page, ActionSheet, Platform, Alert, NavController} from 'ionic-angular';
import {AuthPage} from "../auth/auth"
import {Backend} from '../../providers/backend/backend';
import {DropPage} from '../drop/drop'
import {CourseDetailsPage} from '../course-details/course-details';

@Page({
  templateUrl: 'build/pages/enrolled-courses/enrolled-courses.html',
})
export class EnrolledCoursesPage {
  enrolledCourses: any[];
  constructor(public nav: NavController, public platform: Platform, public backend: Backend) {
    this.backend.enrolledCourses(backend.userDetails._id)
      .then(enrolledCourses => {
        this.enrolledCourses = enrolledCourses;
      });
  }
  viewCourse(course) {
    this.nav.push(CourseDetailsPage, { id: course._id })
  }
  dropCourse(course) {
    let dropConfirm = Alert.create({
      title: 'Drop Course',
      message: 'Are you sure you want to drop this class?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Drop',
          handler: () => {
            this.backend.dropCourse(course._id).then(function () {
              console.log("successfully dropped");
            });
          }
        }
      ]
    });
    this.nav.present(dropConfirm);
  }
  openMenu(course) {
    let actionSheet = ActionSheet.create({
      title: 'Options',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Drop',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.dropCourse(course);
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
    //ToDo I will change this
    logOut() {
      this.backend.logout();
      this.nav.push(AuthPage);
    }
  }
