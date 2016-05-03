var restify = require('restify');
var mongojs = require('mongojs');
var morgan = require('morgan');
var ObjectId = mongojs.ObjectId;

//var db = mongojs('mongodb://admin:admin123@ds053718.mongolab.com:53718/restifymyapp', ['products']);
var db = mongojs('coyotendance', ['courses', 'users' , 'list']);



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

server.get("/initial", function (req, res, next) {
    console.log("reaching initial");
    var courseObject = {
        courses: [602, 655, 610, 630, 670, 520, 565, 680, 594],
        locations: [JB110, JB100, JB200, Jb230, Jb450]
    }
    res.end(JSON.stringify(courseObject));
    return courseObject;
});

server.get("/courses", function (req, res, next) {
    db.courses.find(function (err, courses) {
        console.log(courses);
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(courses));
    });
    return next();
});
    

// Add a new course
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


server.del('/course/:id', function (req, res, next) {
    console.log("reaching server deleted", req.params.id);
   
    db.courses.remove({
        _id: ObjectId(req.params.id)
    }, function (err, data) {
        console.log(err, data);
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(true));
    });
    return next();
});

// Update existing course.
server.post('/course/:id', function (req, res, next) {
    console.log(">>> in server   " + req.params.id, req.params, req.body);  // params.id anedi, url lo untene ostundi.
    // get the existing product
    db.courses.findOne(ObjectId(req.params.id), function (err, data) {
        var paramCourse = JSON.parse(req.body);
        delete paramCourse["_id"];
        db.courses.update({_id: ObjectId(req.params.id)}, 
            {$set: paramCourse}, {multi: true}, 
            function (err, data) {
                console.log(err, data);
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
            });
    });
    return next();
});

server.get('/course/:id', function (req, res, next) {
    db.courses.findOne({
        id: ObjectId(req.params.id)
    }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));
    });
    return next();
});

module.exports = server;