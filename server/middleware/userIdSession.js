// middleware/getUserIdFromSession.js

const getUserIdFromSession = (req, res, next) => {
    console.log("Session userId:", req.body.userId); // Check if userId is correctly retrieve
    next();
  };
  
  module.exports = getUserIdFromSession;
  