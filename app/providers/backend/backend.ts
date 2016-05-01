import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Backend provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Backend {
  courses: any = null;  
  BASE_URL : string = "http://localhost:8888/"

  constructor(public http: Http) {}

  loadCourses(userId : string) {
    if (this.courses) {
      return Promise.resolve(this.courses);
    }    
    return new Promise(resolve => {
      this.http.get(this.BASE_URL + "courses.php")
        .map(res => res.json())
        .subscribe(data => {
          this.courses = data;
          resolve(data);
        });
    }); 
  }
  
  saveCourse(userId : string, course : any) {
    return new Promise(resolve => {
      this.http.post(this.BASE_URL + "course.php", "")
        .subscribe(data => {
          resolve(data);
        });
    });    
  }
  
  searchCourses(searchQuery : string) {
    return new Promise(resolve => {
      this.http.get(this.BASE_URL + "course.php?q=" + searchQuery)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
    });        
  }
  
  markAttendance(userId : string, courseId : string) {
    return new Promise(resolve => {
      this.http.post(this.BASE_URL + "attendance.php", "")
        .subscribe(data => {
          resolve(data);
        });
    });        
  }
  
  markStudentAttendance(userId : string, studentId : string, courseId : string) {
    return new Promise(resolve => {
      this.http.post(this.BASE_URL + "prof_attendance.php", "")
        .subscribe(data => {
          resolve(data);
        });
    });            
  }
  
  login(userId, password) {
    return new Promise(resolve => {
      this.http.post(this.BASE_URL + "login.php", "")
        .subscribe(data => {
          resolve(data);
        });
    });                
  }  
}

