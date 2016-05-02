var restify = require('restify');
var mongojs = require('mongojs');
var morgan  	=   require('morgan');
 
//var db = mongojs('mongodb://admin:admin123@ds053718.mongolab.com:53718/restifymyapp', ['products']);
var db = mongojs('coyotendance', ['courses', 'users']);

 
// Server
var server = restify.createServer();
 
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(morgan('dev')); // LOGGER
 
// CORS
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
 
server.listen(8888, function () {
    console.log("Server started @ 8888");
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
    var course = req.params;
    db.courses.save(course,
        function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    return next();
});

// Update existing course.
server.put('/course/:id', function (req, res, next) {
    // get the existing product
    db.courses.findOne({
        id: req.params.id
    }, function (err, data) { 
        var updatedCourse = {}; // updated courses 
        // logic similar to jQuery.extend(); to merge 2 objects.
        for (var n in data) {
            updatedCourse[n] = data[n];
        }
        for (var n in req.params) {
            updatedCourse[n] = req.params[n];
        }
        db.courses.update({
            id: req.params.id
        }, updatedCourse, {
            multi: false
        }, function (err, data) {
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
        id: req.params.id
    }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));
    });
    return next();
});

module.exports = server;