const db = require('../config/db');
const bcrypt = require('bcrypt')

function createUser(userData, token, tokenDeadline, callBack) {
  const { emailAddress, userPassword, role } = userData;
  const query = "INSERT INTO USERS (email, userPassword, isValidated, token, tokenExpires, role) VALUES (?,?,?,?,?,?)";
  console.log(userPassword);

  db.query(query, [emailAddress, userPassword, "false", token, tokenDeadline, role], (err, result) => {
    if (err) {
      return callBack(err);
    }
    callBack(null, result);
  });
}

function signInUser(userData, callBack) {
  const { emailAddress, userPassword } = userData;
  const query = "SELECT * FROM users WHERE email = ?";
  
  db.query(query, [emailAddress], async (err, rows) => {
    if (err) {
      console.error("Error checking user existence:", err);
      return callBack(err);
    }

    if (rows.length === 0) {
      return callBack(null, {
        error: true,
        type: "email",
        msg: "Email Address does not exist"
      });
    }

    const user = rows[0];
    
    try {
      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);

      if (!passwordMatch) {
        return callBack(null, {
          error: true,
          type: "password",
          msg: "Password is Incorrect"
        });
      }

      // Passwords match, return the user object without the password
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.userPassword; // Remove password from user object

      callBack(null, { error: false, user: userWithoutPassword });
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return callBack(error);
    }
  });
}


module.exports = { signInUser };


module.exports = { createUser, signInUser };
