const { createUser, signInUser } = require('../models/userModels');
const db = require('../config/db');
const crypto = require("crypto")
const { sendVerificationEmail, sendResetEmail } =  require("../utils/sendEmailVerification")
const bcrypt = require('bcrypt');

function registerUser(req, res) {
    const userData = req.body;
    const { emailAddress, userPassword } = userData;
    const verifyEmailToken = crypto.randomBytes(32).toString('hex');
    const verifyEmailDeadline = new Date(Date.now() + 3600000);
  
    db.query("SELECT * FROM users WHERE email = ?", [emailAddress], (err, rows) => {
      if (err) {
        console.error("Error checking user existence:", err);
        return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
      }
  
      if (rows.length > 0) {
        return res.status(400).json({ errors: [{ msg: "Email Address already exists", path: "emailAddress" }] });
      }
  
      // Hash the password
      bcrypt.hash(userPassword, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error("Error hashing password:", hashErr);
          return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
        }
  
        // Update userData with the hashed password
        userData.userPassword = hashedPassword;
  
        createUser(userData, verifyEmailToken, verifyEmailDeadline, (createErr, result) => {
          if (createErr) {
            console.error("Error creating user:", createErr);
            return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
          }
  
          // Send email verification after user creation
          sendVerificationEmail(emailAddress, verifyEmailToken, res);
  
          res.status(200).json({ message: "User created successfully" });
        });
      });
    });
}

function verifyUserEmail(req, res) {
  const token = req.query.token;
  const query = "SELECT * FROM users WHERE token = ?";

  db.query(query, [token], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (rows.length > 0) {
      const userId = rows[0].userId; // Extract userId from rows

      const updateQuery = "UPDATE users SET isValidated = 'true' WHERE token = ?";

      db.query(updateQuery, [token], (err, results) => {
        if (err) {
          console.error("Error updating user:", err);
          return res.status(400).json({ error: "Error validating your email Address. Please try again later" });
        }

        // If update is successful, proceed to initialize session
        initializeSessionOnSignUp(req, res, userId, rows[0].username); // Assuming username is in rows
      });
    } else {
      res.status(400).json({ error: "Invalid Token, try again later" });
    }
  });
}

function initializeSessionOnSignUp(req, res, userId, username) {
  req.session.authenticated = true;
  req.session.userId = userId;
  req.session.username = username;

  // Query database to get user's role based on userId
  db.query("SELECT role FROM users WHERE userId = ?", [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      const userRole = result[0].role; // Assuming 'role' is a field in your users table
      req.session.role = userRole;

      if (userRole === "Service Provider") {
        res.status(200).json({ message: "Redirect to Profile Setup" , userId: userId, role: "Service Provider"});
      } else {
        res.status(200).json({ message: "Redirect to Home" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
}


function initializeSessionOnSignIn(req, res, user) {
  req.session.authenticated = true;
  req.session.userId = user.userId;
  req.session.role = user.role

  console.log(req.session)
  res.status(200).json({
    message: "User signed in successfully",
    role: req.session.role
  });
}



function signInUserController(req, res) {
  const userData = req.body;

  signInUser(userData, (err, result) => {
    if (err) {
      console.error("Error signing in user:", err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.error) {
      return res.status(400).json({
        type: result.type,
        msg: result.msg
      });
    }

    req.session.authenticated = true;
    req.session.userId = result.user.userId;
    req.session.role = result.user.role;

    console.log(req.session);
    res.status(200).json({
      message: "User signed in successfully",
      role: req.session.role
    });
  });
}


function requestPasswordReset(req, res) {
    const { email } = req.body;
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    const query = 'UPDATE users SET token = ?, tokenExpires = ? WHERE email = ?';
    db.query(query, [resetToken, resetTokenExpires, email], (err, results) => {
        if (err) {
            console.error('Error updating user with reset token:', err);
            return res.status(500).json({ error: 'Error requesting password reset' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'No user found with that email' });
        }

        sendResetEmail(email, resetToken);
        res.status(200).json({ message: 'Password reset email sent' });
    });
};

async function resetPassword(req, res) {
  const { token, userPassword } = req.body;

  try {
      // Ensure newPassword is defined and not empty
      if (!userPassword) {
          return res.status(400).json({ error: 'New password is required' });
      }

      // Hash the new password before storing it
      const hashedPassword = await bcrypt.hash(userPassword, 10);

      const query = 'SELECT * FROM users WHERE token = ? AND tokenExpires > ?';
      db.query(query, [token, new Date(Date.now())], async (err, results) => {
          if (err) {
              console.error('Error querying the database:', err);
              return res.status(500).json({ error: 'Error resetting password' });
          }

          if (results.length === 0) {
              return res.status(400).json({ error: 'Invalid or expired token' });
          }

          const user = results[0];

          const updateQuery = 'UPDATE users SET userPassword = ?, token = NULL, tokenExpires = NULL WHERE userId = ?';
          db.query(updateQuery, [hashedPassword, user.id], (updateErr) => {
              if (updateErr) {
                  console.error('Error updating password:', updateErr);
                  return res.status(500).json({ error: 'Error resetting password' });
              }

              // Respond to client only after database operations are complete
              res.json({ message: 'Password reset successfully' });
          });
      });
  } catch (error) {
      console.error('Error hashing the password:', error);
      return res.status(500).json({ error: 'Error resetting password' });
  }
}


module.exports = { resetPassword };


module.exports = { resetPassword };


module.exports = { resetPassword };



module.exports = { registerUser, signInUserController, requestPasswordReset, resetPassword, verifyUserEmail, initializeSessionOnSignUp, initializeSessionOnSignIn };
