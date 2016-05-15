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
  __addOrUpdateCourse(course: any) {
    if (this.courseById[course._id]) {
      this.__removeCourse(course._id);
    }
    this.courses.push(course);
    this.courseById[course._id] = course;
  }

  __removeCourse(id: string) {
    var course = this.courseById[id];
    console.log("remove", this.courseById[id]);
    var index = this.courses.indexOf(course, 0);
    if (index > -1) {
      this.courses.splice(index, 1);
    }
  }

  _removeEnrolledCourse(id) {
    var index = this.enrolled.map(function (x) { return x._id; }).indexOf(id);
    console.log("id , index : " + id + " >>>>>>" + index);
    if (index > -1) {
      this.enrolled.splice(index, 1);
      console.log("this.enrolled ", this.enrolled);
    }
  }

  _removeAvailableCourse(id) {
    var index = this.available.map(function (x) { return x._id; }).indexOf(id);
    console.log("id , index : " + id + " >>>>>>" + index);
    if (index > -1) {
      this.available.splice(index, 1);
      for (var course of this.available) {
        console.log("this.available ", course);
      }
    }
  }

  _addEnrolledCourses(course) {
    this.enrolled.push(course);
  }

  _addAvailableCourses(course) {
    this.available.push(course);
  }
 
  getEnrolledStudents(course_id) {
    var courseId = JSON.stringify(course_id);
    return new Promise<any[]>(resolve => {
      this.http.get(this.BASE_URL + "course/" + course_id + "/" + "users")
        .map(res => res.json())
        .subscribe(data => {
          this.studentEnrolledForClass = data;
          this.studentFullData(data, course_id);
          resolve(this.studentEnrolledForClass);
        });
    });
  }
  
  studentFullData(data : any[], course_id) {
    var studentFullData = JSON.stringify(data);
    var courseId = JSON.stringify(course_id);
    console.log("courseID : " +courseId);
    console.log("studentFullData : " +studentFullData);
    return new Promise<any[]>(resolve => {
      this.http.post(this.BASE_URL + "course/" + course_id + "/studentFullData", studentFullData)
        .map(res => res.json())
        .subscribe(data => {
          this.studentEnrolledForClass = data;
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
            this._addAvailableCourses(course);
          }
          console.log("this.available ", this.available);
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
          console.log("this.enrolled ", this.enrolled);
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
    return new Promise(resolve => {
      this.http.get(this.BASE_URL + "professor/" + course_id)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
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
          this._removeAvailableCourse(data._id);
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
          this._addAvailableCourses(data);
          this._removeEnrolledCourse(data._id);
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
}

