

// const isAuthenticated = (req, res, next) => {
//   console.log("isAuthenticated", req.isAuthenticated);
//   // Check if user is authenticated (e.g., using passport.authenticate)
//   if (req.isAuthenticated()) {
//     next(); // Proceed to the route handler
//   } else {
//     res.status(401).json({ error: 'Unauthorized' }); // Return 401 for unauthenticated users
//   }
// };

function isAuthenticated(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided" });
  }

  try {
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