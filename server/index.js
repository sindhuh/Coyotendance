var restify = require('restify');
var mongojs = require('mongojs');
var morgan = require('morgan');
var ObjectId = mongojs.ObjectId;
var pwdMgr = require('../auth/managePasswords');


//var db = mongojs('mongodb://admin:admin123@ds053718.mongolab.com:53718/restifymyapp', ['products']);
var db = mongojs('coyotendance', ['courses', 'users', 'appUsers']);



// Server
var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: true }));
server.use(morgan('dev')); // LOGGER

// CORS
server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

server.listen(8888, function () {
    console.log("Server started @ 8888");
});

server.post('/login/:email', function (req, res, next) {
    var user = JSON.parse(req.body);
    /*if (user.email.trim().length == 0 || user.password.trim().length == 0) {
        res.writeHead(403, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify({
            error: "Invalid Credentials"
        }));
    }*/
    db.appUsers.findOne({
        email: req.params.email
    }, function (err, dbUser) {
        pwdMgr.comparePassword(user.password, dbUser.password, function (err, isPasswordMatch) {
            if (isPasswordMatch) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                // remove password hash before sending to the client
                dbUser.password = "";
                res.end(JSON.stringify(dbUser));
            } else {
                res.writeHead(403, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify("Invalid User"));
            }

        });
    });
    return next();
});
server.post('/register', function (req, res, next) {
    var user = JSON.parse(req.body);
    pwdMgr.cryptPassword(user.password, function (err, hash) {
        user.password = hash;
        db.appUsers.insert(user,
            function (err, dbUser) {
                if (err) { // duplicate key error
                    if (err.code == 11000) /* http://www.mongodb.org/about/contributors/error-codes/*/ {
                        res.writeHead(400, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify({
                            error: err,
                            message: "A user with this email already exists"
                        }));
                    }
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    dbUser.password = "";
                    res.end(JSON.stringify(dbUser));
                }
            });
    });
    return next();
});


server.get("/initial/:id", function (req, res, next) {
    db.courses.find({ "professorID": req.params.id }, function (err, courses) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        var courseObjectlist = {
            courses: courses,
            locations: ["JB110", "JB100", "JB200", "Jb230", "Jb450"]
        }
        res.end(JSON.stringify(courseObjectlist));
    });
    return next();
});

server.get("/courses/:id", function (req, res, next) {
    db.courses.find({ "professorID": req.params.id }, function (err, courses) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(courses));
    });
    return next();
});

server.get('/enrolledCourses/:id', function (req, res, next) {
    db.courses.find({ "students.studentId": req.params.id }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));
    });
    return next();
});

server.post('/users', function (req, res, next) {
    var students = JSON.parse(req.body);
    console.log("req.body  ", req.body, students);
    db.appUsers.find('_id', { $exits: true, $in: students.studentId }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        data.password = "";
        console.log(data);
        res.end(JSON.stringify(data));
    });
    return next();
});


server.get('/availableCourses/:id', function (req, res, next) {
    db.courses.find({ "students.studentId": { $ne: req.params.id } }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));
    });
    return next();
});



server.post('/course', function (req, res, next) {
    var course = JSON.parse(req.body);
    db.courses.save(course,
        function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    return next();
});

server.post('/enrollcourse/:id', function (req, res, next) {
    var studentId = JSON.parse(req.body); // ide neeku {studentId:"blah blah"} la ostundemo./
    console.log(">>>>>>>>>> ", studentId);
    db.courses.findOne(ObjectId(req.params.id), function (err, data) {
        db.courses.update({ _id: ObjectId(req.params.id) },
            { $push: { "students":  studentId  } },
            function (err, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
            });
        res.end(JSON.stringify(data));
        return next();
    });
});

server.post('/dropCourse/:id', function (req, res, next) {
    var studentId = JSON.parse(req.body);
    db.courses.findOne(ObjectId(req.params.id), function (err, data) {
        db.courses.update({ _id: ObjectId(req.params.id) },
            { $pull: { "students": { "studentId": studentId } } },
            function (err, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
            });
        res.end(JSON.stringify(data));
        return next();
    });
});

server.del('/course/:id', function (req, res, next) {
    db.courses.remove({
        _id: ObjectId(req.params.id)
    }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(true));
    });
    return next();
});
server.post('/course/:id', function (req, res, next) {
    var paramCourse = JSON.parse(req.body);
    db.courses.findOne(ObjectId(req.params.id), function (err, data) {
        var paramCourse = JSON.parse(req.body);
        delete paramCourse["_id"];
        db.courses.findAndModify({
            query: { _id: ObjectId(req.params.id) },
            update: { $set: paramCourse },
            new: true,
            upsert: true
        }, function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    });
});
server.get('/course/:id', function (req, res, next) {
    db.courses.findOne(
        ObjectId(req.params.id)
        , function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    return next();
});

module.exports = server;