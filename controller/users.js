const User = require("../models/User");
const { http, USER_CREATE_AUTHORIZED_USER_MAP } = require("../utils");
const { validator } = require("../utils/common");

module.exports.register = async (req, res, next) => {
  console.log("control inside register")
  // const userMeta = { username:req.parameter?.username, password:req.parameter?.password };

  try {

    const user = new User(req.parameter);

    console.log("validating user...");
    if (userValidateRes?.isValid) {

      User.register(user, req.parameter.password, function (err, msg) {
        console.log("control inside the ", msg);

        if (err) {
          return next(err);
        } else {
          return res.status(http.statusCode[201]).json({ success: true, message: 'User created successfully' });
        }
      }
      );

    }
    return res.status(http.statusCode[401]).json(userValidateRes);
  } catch (err) {
    next(err)
  }
}

module.exports.login = async (mobile, password) => {
  console.log("control inside login...")
  let user = await User.find({ mobile });

  if (!user || user.length < 1) {
    throw ({ status: 401, message: 'Invalid credentials' });
  }
  user = user[0];

  const isPasswordValid = user.validPassword(password);

  if (!isPasswordValid) {
    throw ({ status: 401, message: 'Wrong credentials' });
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
  if (pageSize > (process.env.MAX_USER_PAGE_SIZE || process.env.MAX_PAGE_SIZE || 30)) {
    pageSize = (process.env.MAX_USER_PAGE_SIZE || process.env.MAX_PAGE_SIZE || 30)
  }

  const condition = {};

  if(userId){
    condition._id = userId;
  }

  // For now we return the users based on the current requesting user
  // but further we need to update the viewing map place of USER_CREATE_AUTHORIZED_USER_MAP

  if (req.parameter.type && USER_CREATE_AUTHORIZED_USER_MAP[req.user.role].includes(req.parameter.type)) {
    condition.role = { $in: [req.parameter.type] }
  } else if(req.parameter.type){
    return next({status:400, message:'Bad Request: Not authorized user to perform this action'})
  }else{
    condition.role = { $in: USER_CREATE_AUTHORIZED_USER_MAP[req.user.role || 0]};
  }
  console.log("condition:", condition)
  const users = await User.getUsers({ condition, currentUserRole: req?.user?.role, page, pageSize });
  res.status(200).json({ success: true, users })

}