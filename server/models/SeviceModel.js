const db = require("../config/db");

function getAllServicesOfServiceProvider(userId, callback) {
    const query = "SELECT * FROM services WHERE provider_id = ?";
    db.query(query, [userId], (err, result) => {
        if (err) {
            return callback(err);
        }
        if (result.length === 0) {
            return callback(null, { message: "No services found for this user" });
        }
        callback(null, result);
    });
}

function getUserDetails(userId, callback) {
    const query = "SELECT first_name, profilePic FROM users WHERE userId = ?";
    db.query(query, [userId], (err, result) => {
        if (err) {
            return callback(err);
        }
        if (result.length === 0) {
            return callback(null, { message: "User not found" });
        }
        callback(null, result[0]);
    });
}

module.exports = {
    getAllServicesOfServiceProvider,
    getUserDetails,
};
