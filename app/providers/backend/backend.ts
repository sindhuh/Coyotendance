import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import 'rxjs/add/operator/map';
import {AuthPage} from "../../pages/auth/auth";

@Injectable()
export class Backend {
  courses: any[] = [];
  available: any[] = [];
  enrolled: any[] = [];
  courseById = {}
  studentEnrolledForClass: any[] = [];
  locations: string[] = []
  initialized: boolean = false
  userDetails: any = null
  BASE_URL: string = "http://localhost:8888/"

  constructor(public http: Http) {
    this.userDetails = JSON.parse(localStorage.getItem("userObject"));
  }

  studentsEnrolled(course_id: any) {

  }

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

  _removeEnrolledCourse(id) {
    var course = this.courseById[id];
    var index = this.enrolled.indexOf(course, 0);
    console.log("index ", id + index);
    if (index > -1) {
      this.enrolled.splice(index, 1);
    }
  }

  _removeAvailableCourse(id) {
    var index = this.available.indexOf(id, 0);
    console.log("index ", id + index);
    if (index > -1) {
      this.available.splice(index, 1);
    }
  }

  _addEnrolledCourses(course) {
    this.enrolled.push(course);
    this._removeAvailableCourse(course._id);
  }

  _addDroppedCourses(course) {
    this.available.push(course);
    this._removeEnrolledCourse(course._id);
  }
  //ToDO little bit confused here
  getEnrolledStudents(course) {
    var courseJson = JSON.stringify(course);
    return new Promise<any[]>(resolve => {
      this.http.post(this.BASE_URL + "users", courseJson)
        .map(res => res.json())
        .subscribe(data => {
          this.studentEnrolledForClass.push(data);
          resolve(this.studentEnrolledForClass);
        });
    });
  }

  initialize(userId) {
    if (this.initialized) {
      return Promise.resolve(true);
    }
    return new Promise(resolve => {
      this.http.get(this.BASE_URL + "initial/" + userId)
        .map(res => res.json())
        .subscribe(data => {
          this.initialized = true;
          for (var course of data.courses) {
            this.__addOrUpdateCourse(course);
          }
          this.locations = data.locations;
          resolve(true);
        });
    });
  }

  loadLocations() {
    return Promise.resolve(this.locations);
  }

  loadCourses(userId): Promise<any[]> {
    if (this.initialized) {
      return Promise.resolve(this.courses);
    }
    return new Promise<any[]>(resolve => {
      this.http.get(this.BASE_URL + "courses/" + userId)
        .map(res => res.json())
        .subscribe(data => {
          for (var course of data) {
            this.__addOrUpdateCourse(course);
          }
          resolve(this.courses);
        });
    });
  }

  availableCourses(userId): Promise<any[]> {
    return new Promise<any[]>(resolve => {
      this.http.get(this.BASE_URL + "availableCourses/" + userId)
        .map(res => res.json())
        .subscribe(data => {
          for (var course of data) {
            this._addDroppedCourses(course);
          }
          resolve(this.available);
        });
    });
  }
  enrolledCourses(userId): Promise<any[]> {
    return new Promise<any[]>(resolve => {
      this.http.get(this.BASE_URL + "enrolledCourses/" + userId)
        .map(res => res.json())
        .subscribe(data => {
          for (var course of data) {
            this._addEnrolledCourses(course);
          }
          resolve(this.enrolled);
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

  updateCourse(course) {
    var courseJson = JSON.stringify(course);
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var options = new RequestOptions({ headers: headers });
    var URL = this.BASE_URL + "course"
    if (course._id) {
      URL = URL + "/" + course._id;
    }
    return new Promise(resolve => {
      this.http.post(URL, courseJson)
        .map(res => res.json())
        .subscribe(data => {
          this.__addOrUpdateCourse(data);
          resolve(data);
        });
    });
  }
  
  getProfessor(course_id) {
    var courseId = JSON.stringify(course_id);  
    return new Promise(resolve => {
      this.http.get(this.BASE_URL + "professor/" +courseId)
        .map(res => res.json())
        .subscribe(data => {
          this._addDroppedCourses(data);
          resolve(data);
        });
    });
  }
  
  enrollCourse(course_id) {
    var studentId = JSON.stringify(this.userDetails._id);    
    console.log("studen : " + studentId)
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var options = new RequestOptions({ headers: headers });
    return new Promise(resolve => {
      this.http.post(this.BASE_URL + "enrollcourse/" + course_id, studentId)
        .map(res => res.json())
        .subscribe(data => {
          this._addEnrolledCourses(data);
          resolve(data);
        });
    });
  }

  dropCourse(course_id) {
    var studentId = JSON.stringify(JSON.parse(localStorage.getItem("userObject"))._id);
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var options = new RequestOptions({ headers: headers });
    return new Promise(resolve => {
      this.http.post(this.BASE_URL + "dropCourse/" + course_id, studentId)
        .map(res => res.json())
        .subscribe(data => {
          this._addDroppedCourses(data);
          resolve(data);
        });
    });
  }

  deleteCourse(id) {
    var headers = new Headers({ 'Content-Type': 'application/json' });
    var options = new RequestOptions({ headers: headers });
    return new Promise(resolve => {
      this.http.delete(this.BASE_URL + "course/" + id)
        .subscribe(data => {
          this.__removeCourse(id);
          resolve(data);
        });
    });
  }

  registerUser(user) {
    var userJson = JSON.stringify(user);
    return new Promise(resolve => {
      this.http.post(this.BASE_URL + "register", userJson)
        .map(res => res.json())
        .subscribe(data => {
          resolve(true);
        });
    });
  }

  loginUser(user) {
    var userJson = JSON.stringify(user);
    return new Promise(resolve => {
      this.http.post(this.BASE_URL + "login/" + user.email, userJson)
        .map(res => res.json())
        .subscribe(data => {
          var userObject = JSON.stringify(data);
          localStorage.setItem("userObject", userObject);
          this.userDetails = JSON.parse(localStorage.getItem("userObject"));
          resolve(true);
        });
    });
  }

  logout() {
    localStorage.removeItem("email");
    localStorage.removeItem("userObject");
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
          this.user =
            resolve(data);
        });
    });
  }
}

