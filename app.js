
var express         = require('express'),
    events          = require('events'),
    path            = require('path'),
    Mongoose        = require('mongoose'),
    jade            = require('jade'),
    morgan          = require('morgan'),
    bodyParser      = require('body-parser'),
    http            = require('http'),
    fs              = require('fs'),
    port            = process.env.PORT || 8000;

// export your app and consume from test for easy mocking your app
var app = module.exports = express();

app.set('port',port);

app.set('view engine','jade');
app.set('views',path.join(__dirname,'backend/views'));

app.use(morgan('dev')); // log every request to console

// bodyParser stuffs
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'})); // parse application/vnd.ap+json as json

// static path
app.use(express.static(path.join(__dirname,'frontend')));

// error handler is only used in dev module._debug();
function errorHandler(err,req,res,next){
    console.log(err.message);
    console.log(err.stack); // stack trace
    res.status(500);
    res.render('error_template',{errro: err});
}

// DEVELOPMENT ONLY
if('development' === app.get('env')) {
    app.use(errorHandler);
}

// routing stuff
app.use(function(req,res,next){
    console.log(req.method,req.url);
    next();
});

// default routing
app.get('/',function(req,res){    
    res.render('index');
});

// connect to mongodb
var db = Mongoose.connect("mongodb://localhost/todolist",function(err){
    if(err) throw err;
});

// allowing request to come from different domains in order to develop  a client-independant system.
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// configure model paths
var model_path = __dirname + "/backend/models";
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file){
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if(stat.isFile()) {
            if(/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if(stat.isDirectory) {

        }
    });
};
walk(model_path);

// create server
http.createServer(app).listen(app.get('port'),function(){
    console.log('Express server listening on port ' + app.get('port'));
});
