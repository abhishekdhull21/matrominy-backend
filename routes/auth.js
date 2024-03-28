

// const isAuthenticated = (req, res, next) => {
//   console.log("isAuthenticated", req.isAuthenticated);
//   // Check if user is authenticated (e.g., using passport.authenticate)
//   if (req.isAuthenticated()) {
//     next(); // Proceed to the route handler
//   } else {
//     res.status(401).json({ error: 'Unauthorized' }); // Return 401 for unauthenticated users
//   }
// };
const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
  let token = req.header('Authorization');

  if (!token) {
      req.isAuthenticated = false;
      return next()
  }

  try {
      console.log("token",token)
      const tokenArray = token.split(' ');
      if (tokenArray.length === 2 && tokenArray[0] === 'Bearer') {
        token = tokenArray[1]; // Extract token from the array
      } 
      const decoded = jwt.verify(token, 'secretKey');
      req.userId = decoded.userId;
      req.isAuthenticated = true;
      next();
  } catch (err) {
      console.error("Error verifying token:", err);
      res.status(401).json({ message: "Invalid token" });
  }
}


module.exports = {
  isAuthenticated,
}