const Favorite = require("../models/Favorite");
const Lead = require("../models/Leads");
const User = require("../models/User");
const {
  validator,
  isProUser,
  noOfProfilesUserView,
  LeadCountType,
  LeadType,
} = require("../utils/common");

module.exports.register = async (req, res, next) => {
  console.log("control inside register");
  // const userMeta = { username:req.parameter?.username, password:req.parameter?.password };

  try {
    const user = new User(req.parameter);
    let userValidateRes = validator.isValidUser(req.parameter);

    console.log("validating user...");
    if (userValidateRes?.isValid) {
      User.register(user, req.parameter.password, function (err, msg) {
        console.log("control inside the ", msg);

        if (err) {
          return next(err);
        } else {
          return res
            .status(201)
            .json({ success: true, message: "User created successfully" });
        }
      });
    } else {
      return res.status(401).json(userValidateRes);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.getProfiles = async(req, res, next)=>{
  console.log("control inside the getProfiles")
  const user = req.user;
  const condition = {
    lookingFor: user.gender,
    gender:user.lookingFor,
    isActive:true,
  };
try{

  const users = await User.getUsers({
    condition
  },{
    name:1,
    last:1,
    username:1,
    gender:1,
    dob:1,
    images:1
  });
  return res.json({success:true, profiles:users});
}catch(e){
  return next({status:401,error:e?.message || "something went wrong"})
}

}

module.exports.login = async (mobile, password) => {
  console.log("control inside login...");
  let user = await User.find({ mobile });

  if (!user || user.length < 1) {
    throw { status: 401, message: "Invalid credentials" };
  }
  user = user[0];

  const isPasswordValid = user.validPassword(password);

  if (!isPasswordValid) {
    throw { status: 401, message: "Wrong credentials" };
  }

  return user;
};

// Retrieve the list of users using pagination
module.exports.getUsers = async (req, res, next) => {
  console.log("control inside the getUsers method");

  let page = req.parameter.page || 1;
  let pageSize = req.parameter.pageSize || 1;

  // if specific results based on id
  const userId = req.params.id;

  // Handled maximum number of items returned per page
  if (
    pageSize >
    (process.env.MAX_USER_PAGE_SIZE || process.env.MAX_PAGE_SIZE || 30)
  ) {
    pageSize =
      process.env.MAX_USER_PAGE_SIZE || process.env.MAX_PAGE_SIZE || 30;
  }

  const condition = {};

  if (userId) {
    condition._id = userId;
  }

  // For now we return the users based on the current requesting user
  // but further we need to update the viewing map place of USER_CREATE_AUTHORIZED_USER_MAP

  if (
    req.parameter.type &&
    USER_CREATE_AUTHORIZED_USER_MAP[req.user.role].includes(req.parameter.type)
  ) {
    condition.role = { $in: [req.parameter.type] };
  } else if (req.parameter.type) {
    return next({
      status: 400,
      message: "Bad Request: Not authorized user to perform this action",
    });
  } else {
    condition.role = {
      $in: USER_CREATE_AUTHORIZED_USER_MAP[req.user.role || 0],
    };
  }
  console.log("condition:", condition);
  const users = await User.getUsers({
    condition,
    currentUserRole: req?.user?.role,
    page,
    pageSize,
  });
  res.status(200).json({ success: true, users });
};

// View Profile
module.exports.viewProfile = async function (req, res, next) {
  // check user pro or not
  const user = req.user;
  const profileUserId = req.params["id"];
  if (!profileUserId) {
    return next({
      status: 401,
      message: "Bad Request: Invalid requested profile",
    });
  }
  if (!(await isProUser(user))) {
    if ((user?.profileViewed || 0) >= noOfProfilesUserView(user?.profileViewUpto)) {
      return next({
        status: 401,
        message: "Bad Request:You need to buy Pro to view more profiles",
      });
    }
  }

  const profile = await User.viewProfile({userID:profileUserId});
  const leadCondition = {
    type:LeadType.PROFILE_VIEW,
    profileViewed:profileUserId,
    userID:user._id
  }
  const leadInDB = await Lead.getLead(leadCondition);
  if(!leadInDB.length){
    await User.increaseProfileViewed({userID:user._id});
  }
  Lead.saveLead(leadCondition)
  return res.status(200).json({ success: true, profile });
};
// Favorite Profile
module.exports.favoriteProfile = async function (req, res, next) {
  console.log("control inside the favoriteProfile");

  // check user pro or not
  const user = req.user;
  const profileUserId = req.parameter["profileID"];
  const favorite = req.parameter["favorite"];
  try {
    if (!profileUserId) {
      return next({
        status: 401,
        message: "Bad Request: Invalid requested profile",
      });
    }
    console.log("favorite profile", user._id);
    await Favorite.favoriteProfile(user?._id, profileUserId, favorite);
    return res.status(200).json({ success: true });
  } catch (err) {
    return next({ status: 401, message: err.message || err });
  }
};

// Update Profile
module.exports.updateProfile = async function (req, res, next) {
  // check user pro or not
  const user = req.User;
  const fieldsToUpdate = req.parameter.fields;
  const profileUserId = req.params["id"];
  if (!profileUserId) {
    return next({
      status: 401,
      message: "Bad Request: Invalid requested profile",
    });
  }

  try {
    await User.updateProfile(profileUserId, fieldsToUpdate);
  } catch (err) {
    return next({ status: 401, message: err.message || err });
  }

  return res.status(200).json({ success: true });
};

// Update Profile
module.exports.getFavoriteProfile = async function (req, res, next) {
  // check user pro or not
  const user = req.user;
  try{
    const favorites = await Favorite.getAll({userID:user._id, isFavorite:true});
    return res.status(200).json({ success:true,favorites: favorites});
  }catch(err){
    return next({ status: 401, message: err.message || err });
  }

}

// View Favorite Profile Count
module.exports.getCount = async function (req, res, next) {
  console.log("control inside the getCount");
  
  // check user pro or not
  const user = req.user;
  const type = req.parameter.type;
  if(!type){
    return next({ status: 401, message:'count not specified'});
  }
  try{
    return res.status(200).json({ success:true,count: await getCount(type,user._id)});
  }catch(err){
    return next({ status: 401, message: err.message || err });
  }

}

async function getCount(type, id){
  let docCount = 0;
    // count of favorite of my profile by others
    if (type == LeadCountType.FAVORITE_ME_BY_OTHERS) {
      // this give the count of favorites by other users
      docCount = await Favorite.getCount({
        userID: id,
        isFavorite: true,
      });
    } else if (type == LeadCountType.FAVORITE_OTHERS_BY_ME) {
      docCount = await Favorite.getCount({
        favoriteProfile: id,
        isFavorite: true,
      });

    } else if (type == LeadCountType.PROFILE_VIEW_BY_ME) {
      docCount = await Lead.getCount({
        type:LeadType.PROFILE_VIEW,
        userID: id,
      });

    }  else if (type == LeadCountType.PROFILE_MY_VIEW_BY_OTHERS) {
      docCount = await Lead.getCount({
        type:LeadType.PROFILE_VIEW,
        profileViewed: id,
      });

    } 

    return docCount;
}

// View Favorite Profile Count
module.exports.getFavoriteProfileCount = async function (req, res, next) {
  // check user pro or not
  const user = req.user;
  try{
    // this give the count of favorites by other users
    const favorites = await Favorite.getCount({userID:user._id, isFavorite:true});
    return res.status(200).json({ success:true,count: favorites});
  }catch(err){
    return next({ status: 401, message: err.message || err });
  }
}