const db = require("../config/db");

const updateProfile = (userId, profileImagePath, bio, callback) => {
  const query = "UPDATE users SET profilePic = ?, bio = ? WHERE userId = ?";
  console.log("Executing query:", query);
  console.log("With parameters:", [profileImagePath, bio, userId]);

  db.query(query, [profileImagePath, bio, userId], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return callback(err);
    }
    console.log("Query result:", result);
    if (result.affectedRows === 0) {
      console.warn("No rows were updated");
      return callback(new Error("No rows were updated"));
    }
    callback(null, result);
  });
};




const insertService = (userId, serviceName, price, aboutService, imagePath, callback) => {
  const query = "INSERT INTO services (provider_id, name, starting_price, about_service, image) VALUES (?, ?, ?, ?, ?)";
  const values = [userId, serviceName, price, aboutService, imagePath];
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return callback({ error: 'Database error occurred' }, null);
    }
    callback(null, result);
  });
};

module.exports = {
  updateProfile,
  insertService,
};
