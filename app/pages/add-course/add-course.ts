import {Page, NavController} from 'ionic-angular';

/*
  Generated class for the AddCoursePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/add-course/add-course.html',
})
export class AddCoursePage {
  id: string;
  name: string;
  constructor(public nav: NavController) {}
  saveClass() {
    var newClass = {
      id: this.id,
      name: this.name
    }
  }
}
