

const isAuthenticated = (req, res, next) => {
  console.log("isAuthenticated", req.isAuthenticated);
  // Check if user is authenticated (e.g., using passport.authenticate)
  if (req.isAuthenticated()) {
    next(); // Proceed to the route handler
  } else {
    res.status(401).json({ error: 'Unauthorized' }); // Return 401 for unauthenticated users
  }
};


module.exports = {
  isAuthenticated,
}