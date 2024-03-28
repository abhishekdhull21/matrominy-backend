const express = require('express');
const createError = require('http-errors');
const path = require('path');

const app = express();
app.use(express.static('multimedia'));
app.use('/multimedia', express.static(path.join(__dirname, 'multimedia')));
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// config db
require('./config/db');
app.use(require('morgan')('dev'));

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const session = require('express-session');
const parameterHandler = require('./controller/parameterHandler');
const MongoStore = require('connect-mongo');

// const MongoDBStore = require('connect-mongodb-session')(session);


const router = require('./routes');
const errorHandler = require('./config/errorHandler');
const User = require('./models/User');
const { upload } = require('./config/Uploader');
const { isAuthenticated } = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(parameterHandler);
// require('./config/passport');
console.log(`process.env.CORS_APPROVED_URLS`,process.env.CORS_APPROVED_URLS );
const corsOptions ={
  origin:[process.env.CORS_APPROVED_URLS],
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));


// Custom middleware to set the session cookie
// const setSessionCookieMiddleware = (req, res, next) => {
//   // Check if the session cookie already exists
//   console.log("req.headers['c-cookie'] ",req.headers['c-cookie'],req.headers['C-Cookie'],req.headers)
//   if(req.headers['c-cookie'] && req.headers['c-cookie'] !== 'undefined'){
//     req.cookies['connect.sid'] = req.headers['c-cookie'];
//   }
  
//   req.cookies['connect.sid'] && res.setHeader('c-cookie', req.cookies['connect.sid']);
//   next(); // Call next to pass control to the next middleware or route handler
// };

// if(process.env.ENABLE_SESSION_COOKIE_MIDDLEWARE){
// Apply the custom middleware to all routes
// app.use(setSessionCookieMiddleware);
// }
// const store = MongoStore.create({ mongoUrl: process.env.MONGO_DB_URL });

// const sessionOptions = {
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   store,
//   cookie: {}
// }

console.log("current env: ", app.get('env'))
// if(app.get('env') === 'production' || process.env.IS_PRODUCTION === 'true' ) {
  console.log("production environment")
  // sessionOptions.cookie = {
  //   SameSite: "none",
  //   secure:true,
  //   maxAge: 1000 * 60 * 60 * 60,
  // }
// }

// const sessionMiddleware = session(sessionOptions);
// app.use(sessionMiddleware);

// const strategy = new LocalStrategy({
//   usernameField: 'mobile',
//   passwordField: 'password',
// }, User.authenticate())
// passport.use(strategy);

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use(passport.initialize());
// app.use(passport.session());

app.use(isAuthenticated);


app.get("/api/auth",(req,res,next)=>{
  return res.json({success: req.isAuthenticated,user:req.isAuthenticated ? {id:req.user?._id, username:req.user?.username, name:`${req.user?.name ||""} ${req.user?.last || ""}`.trim(), role:req.user?.role} : null})
})

  app.post("/upload", upload.single("image"), (req, res) => {
    if (req.file) {

        res.send({success:true,url:req.file.destination+req.file.filename,info:req.file,message:"file uploaded successfully"});
      } else {
        res.status(400).send("Please upload a valid image");
      }
    });


app.use("/api", router);
app.use(errorHandler)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' && !process.env.IS_PRODUCTION ? err : {};

  // render the error page
  res.status(err.status || 500).json({ success: false, message: '404 Not Found' });

});




app.listen(process.env.PORT || 8000, () => {
  console.log(`Server listening on port ${process.env.PORT || 8000}`);
})