const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passportLocalMongoose = require('passport-local-mongoose');


const commonSchema = require('./common');

const schema = new mongoose.Schema({
  email:{type: String, required: true},

  username: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    unique: function () { return (this.mobile !== null && this.mobile !== undefined && this.mobile.trim() !== '') },
    required: function () { return this.role !== USER_ROLES.PLAYER; },
  },
  
  dob:{type:Date},
  gender:{type:String,required: true, enum:['Male', 'Female'], default:'Male'},
  lookingFor:{type:String,required: true, enum:['Male', 'Female'],default:'Female'},
  isSingle:{type:Boolean,default:true},
  address:{
    zipCode:String,
    city:String,
    state:String,
    country:String,
  },
  role: {
    type: Number,
    enum: ['User','Pro','Admin'],
    default: 'User'
  },
  isActive:{type:Boolean,default:true},
});

schema.add(commonSchema);

schema.plugin(passportLocalMongoose,
  {
    usernameField: 'mobile',
    passwordField: 'password',
  }
);

// Middleware to hash the password before saving
schema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) return next(err);

        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const defineProjection = (role) => {
  let projectionField = {}
  switch (role) {
    case USER_ROLES.SUPER_ADMIN:
    case USER_ROLES.ADMIN:
      break;
    case USER_ROLES.USER:
      projectionField = { _id: 1, username: 1, mobile: 1 }; // Define fields accessible to regular users
      break;
  }

  return projectionField;
};
schema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

schema.statics.addUsers = function (users = []) {
  console.log("control inside the addUsers");

  return this.insertMany(users);
};
schema.statics.getUsers = async function ({ condition, page = 1, pageSize = 10, currentUserRole = 6 } = {}) {
  try {
    console.log("Control inside the getUsers");

    const skip = (page - 1) * pageSize;

    const projection = defineProjection(currentUserRole);
    const users = await this.find(condition, projection)
      .skip(skip)
      .limit(pageSize);

    return users;
  } catch (error) {
    console.error('Error in getUsers:', error.message);
    throw error;
  }
};

const User = mongoose.model('User', schema);

module.exports = User;