import {Platform, Alert, Page, ActionSheet, NavController} from 'ionic-angular';
import {Backend} from '../../providers/backend/backend';
import {AddCoursePage} from '../add-course/add-course';
import {AuthPage} from '../auth/auth';
import {CourseDetailsPage} from '../course-details/course-details';

@Page({
  templateUrl: 'build/pages/page1/page1.html',
})
export class Page1  {
  courses: any[];
  locations : any[];

  constructor(public nav: NavController, public backend: Backend, public platform: Platform) {
    this.backend.initialize(this.backend.userDetails._id).then(success => {
      if (success) {
        this.backend.loadCourses(this.backend.userDetails._id).then(courses => {       
          this.courses = courses;  
        });
      }
    });
  }

  
  addCourse() {
    this.nav.push(AddCoursePage);
  }
  
  viewCourse(course) {
    this.nav.push(CourseDetailsPage, { id: course._id })
  }
 
  deleteCourse(course){
    let dropConfirm = Alert.create({
      title: 'Delete Course',
      message: 'Are you sure you want to delete this class?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.backend.deleteCourse(course._id).then(function () {
              console.log("successfully dropped");
            });
          }
        }
      ]
    });
    this.nav.present(dropConfirm);
  }
  
  logOut() {
    this.backend.logout();
    this.nav.push(AuthPage);
  }
  editCourse(course) {
    this.nav.push(AddCoursePage, {id: course._id});
  }
  openMenu(course) {
    let actionSheet = ActionSheet.create({
      title: 'Options',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.deleteCourse(course);
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
          text: 'Edit',
          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            this.editCourse(course);
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
  