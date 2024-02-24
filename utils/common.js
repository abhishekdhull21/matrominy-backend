const { mongoose } = require("mongoose");




module.exports.isValidObjectId = (value) => {
  /**
   * Checks the given value matches the validation of mongoose _id field
   * 
   * @param {String} value
   * @returns {Boolean}
   */
  return mongoose.Types.ObjectId.isValid(value);
}

module.exports.toString = (data) => {
  /**
   * Checks the given value matches the validation of mongoose _id field
   * 
   * @param {String} data
   */
  console.log("Checking data:",data);
  if(Array.isArray(data)){
    return data.map(value => value.toString());
  }else if(typeof data === 'object'){
    return;

  }
  return data?.toString();
}

module.exports.isAuthenticated = (req, res, next) => {
  return (req.isAuthenticated()) ? next() : next({ status: 401, message: 'Unauthenticated Request' });
}