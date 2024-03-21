const express = require('express');
const createError = require('http-errors');
const app = express();
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
// require('./config/passport');
const corsOptions ={
  origin: ["http://localhost:3000", ...(process.env.CORS_APPROVED_URLS || [])],
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));


const store = MongoStore.create({ mongoUrl: process.env.MONGO_DB_URL });
const sessionMiddleware = session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, store })
app.use(sessionMiddleware);

const strategy = new LocalStrategy({
  usernameField: 'mobile',
  passwordField: 'password',
}, User.authenticate())
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());




app.get("/api/auth",(req,res,next)=>{
  return res.json({success: req.isAuthenticated(),user:req.isAuthenticated() ? {id:req.user?._id, username:req.user?.username, name:`${req.user?.name ||""} ${req.user?.last || ""}`.trim(), role:req.user?.role} : null})
})

  app.post("/upload", upload.single("image"), (req, res) => {
    if (req.file) {

        res.send({success:true,url:req.file.destination+req.file.filename,info:req.file,message:"file uploaded successfully"});
      } else {
        res.status(400).send("Please upload a valid image");
      }
    });

app.use(parameterHandler);
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
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({ success: false, message: '404 Not Found' });

});




app.listen(process.env.PORT || 8000, () => {
  console.log(`Server listening on port ${process.env.PORT || 8000}`);
})