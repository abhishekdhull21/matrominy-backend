const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");

const commonSchema = require("./common");
const { number } = require("joi");

const schema = new mongoose.Schema({
  email: { type: String },
  full_name: String,
  last: String,
  username: {
    type: String,
    // required: true,
  },
  mobile: {
    type: String,
    // unique: function () { return (this.mobile !== null && this.mobile !== undefined && this.mobile.trim() !== '') },
  },
  age: Number,
  images: [{ type: String }],
  bio: { type: String },
  dob: { type: Date },
  occupation: String,
  about: String,
  hobby: String,
  personType: String,
  height: String,
  weight: String,
  hairColor: String,
  eyeColor: String,
  bodyType: String,
  ethnicity: String,
  lifestyle: {
    interest: String,
    favoriteVocations: String,
    lookingFor: String,
    smoking: String,
    language: String,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
    default: "Male",
  },
  lookingFor: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
    default: "Female",
  },
  isSingle: { type: String, default: true },
  religion: String,
  address: {
    streetAddress: String,
    zipCode: String,
    city: String,
    state: String,
    country: String,
  },

  role: {
    type: String,
    enum: ["User", "Pro", "Admin"],
    default: "User",
  },
  isActive: { type: Boolean, default: true },
  profileViewUpto: Number,
  password: String,
  profileViewed: { type: Number, default: 0 },
});

schema.add(commonSchema);

schema.plugin(passportLocalMongoose, {
  usernameField: "mobile",
  passwordField: "password",
});

// Middleware to hash the password before saving
schema.pre("save", function (next) {
  if (this.isModified("password")) {
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

// const defineProjection = (role) => {
//   let projectionField = {}
//   switch (role) {
//     case USER_ROLES.SUPER_ADMIN:
//     case USER_ROLES.ADMIN:
//       break;
//     case USER_ROLES.USER:
//       projectionField = { _id: 1, username: 1, mobile: 1 }; // Define fields accessible to regular users
//       break;
//   }

//   return projectionField;
// };
schema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

schema.statics.findUser = async function (condition, projection) {
  return await this.findOne(condition, { password: 0, ...projection });
};

schema.statics.addUsers = function (users = []) {
  console.log("control inside the addUsers");

  return this.insertMany(users);
};
schema.statics.getUsers = async function ({
  condition,
  page = 1,
  pageSize = 10,
  currentUserRole = 6,
} = {}) {
  try {
    console.log("Control inside the getUsers", condition);
    const skip = (page - 1) * pageSize;

    // const projection = defineProjection(currentUserRole);
    // const users = await this.find(condition, projection)
    // const users = await this.find(condition).skip(skip).limit(pageSize);
    const users = await this.find(condition);
    return users;
  } catch (error) {
    console.error("Error in getUsers:", error.message);
    throw error;
  }
};

schema.statics.viewProfile = async function ({ userID, isSelf } = {}) {
  console.log("Control inside the viewProfile");

  let fields = {
    name: 1,
    last: 1,
    username: 1,
    gender: 1,
    images: 1,
    bio: 1,
    age: 1,
  };
  if (isSelf) {
    fields = {
      ...fields,
      mobile: 1,
      email: 1,
      lookingFor: 1,
      isSingle: 1,
      address: 1,
      lifestyle: 1,
      hobby: 1,
      personType: 1,
      height: 1,
      weight: 1,
      hairColor: 1,
      eyeColor: 1,
      bodyType: 1,
      ethnicity: 1,
    };
  }
  try {
    const user = await this.findById(userID, fields);
    return user;
  } catch (error) {
    console.error("Error in getUsers:", error.message);
    throw error;
  }
};

schema.statics.updateProfile = function (id, updateFields) {
  const update = {};
  if (updateFields.image) {
    update["$addToSet"] = { images: updateFields.image };
    delete updateFields.image;
  }
  update["$set"] = { ...updateFields };
  return this.findOneAndUpdate({ _id: id }, update);
};

schema.statics.increaseProfileViewed = async function ({ userID } = {}) {
  try {
    console.log("Control inside the viewProfile");
    const user = await this.findById(userID);
    user.profileViewed = (user.profileViewed || 0) + 1;
    user.save();
  } catch (error) {
    console.error("Error in getUsers:", error.message);
    throw error;
  }
};

const User = mongoose.model("user", schema);

module.exports = User;
