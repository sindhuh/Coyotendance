import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import 'rxjs/add/operator/map';


/*
  Generated class for the Backend provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Backend {
  courses: any[] = []
  courseById = {}
  initialized: boolean = false
  BASE_URL: string = "http://localhost:8888/"

  constructor(public http: Http) { }

  __addOrUpdateCourse(course: any) {
    if (this.courseById[course._id]) {
      this.__removeCourse(course._id);      
    }
    this.courses.push(course);
    this.courseById[course._id] = course;
  }
  
  __removeCourse(id: string) {
    var course = this.courseById[id];
    var index = this.courses.indexOf(course, 0);
    if (index > -1) {
      this.courses.splice(index, 1);
    }
  }
  
  loadCourses(userId: string) {
    if (this.initialized) {
      return Promise.resolve(this.courses);
    }
    return new Promise(resolve => {
      this.http.get(this.BASE_URL + "courses")
        .map(res => res.json())
        .subscribe(data => {
          for (var course of data) {
            this.__addOrUpdateCourse(course);
          }
          this.initialized = true;
          resolve(data);
        });
    });
  }
  
  getCourse(courseId: string) {
    if (this.courses) {
      for (var course of this.courses) {
        if (course._id == courseId) {
           return Promise.resolve(course);
        }
      }
    }    
    return new Promise(resolve => {
      this.http.get(this.BASE_URL + "course/" + courseId)
        .map(res => res.json())
        .subscribe(data => {
          this.courses.push(data);
          resolve(data);
        });
    });    
  }
  loadCourselist() {
    return new Promise(resolve => {
      this.http.get(this.BASE_URL + "initial/")
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
          console.log(".........", data);
        });
    });    
  }
  updateCourse(course) {
    var courseJson = JSON.stringify(course);
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var options = new RequestOptions({ headers: headers });
    if (course._id) {
      return new Promise(resolve => {
        this.http.post(this.BASE_URL + "course/" + course._id, courseJson)
          .subscribe(data => {
            console.log(">>>>>> Data is ", data);
            //this.__addOrUpdateCourse()
            resolve(data);
          }); 
      });      
    } else {
      return new Promise(resolve => {
        this.http.post(this.BASE_URL + "course", courseJson)
          .subscribe(data => {
            console.log(">>>>>> Data is ", data);
            //this.__addOrUpdateCourse
            resolve(data);
          });
      });      
    }
  }
  list() {
   
  }
 
   deleteCourse(id) {
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var options = new RequestOptions({ headers: headers });
    return new Promise(resolve => {
      console.log("reaching correctly")
      this.http.delete(this.BASE_URL + "course/" + id)
        .subscribe(data => {
          this.__removeCourse(id);          
          resolve(data);
        });
    });
  }
  
  searchCourses(searchQuery: string) {
    return new Promise(resolve => {
      this.http.get(this.BASE_URL + "course.php?q=" + searchQuery)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  markAttendance(userId: string, courseId: string) {
    return new Promise(resolve => {
      this.http.post(this.BASE_URL + "attendance", "")
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  markStudentAttendance(userId: string, studentId: string, courseId: string) {
    return new Promise(resolve => {
      this.http.post(this.BASE_URL + "prof_attendance", "")
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  login(userId, password) {
    return new Promise(resolve => {
      this.http.post(this.BASE_URL + "login", "")
        .subscribe(data => {
          resolve(data);
        });
    });
  }
}

