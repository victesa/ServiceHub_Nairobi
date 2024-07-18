const profileModel = require("../models/ProfileModel");

const setupProfile = (req, res) => {
  const { userId } = req.body;
  const { bio, serviceList } = req.body;
  const parsedServiceList = JSON.parse(serviceList);
  const {profileImage} = req.body

  // Insert profile details into the database
  profileModel.updateProfile(userId, profileImage, bio, (err, result) => {
    if (err) {
      console.error("Error inserting profile:", err);
      return res.status(500).json({ error: "Database insertion error" });
    }

    const profileId = result.insertId; // Get the inserted profile's ID

    // If there are services to be inserted
    if (parsedServiceList && parsedServiceList.length > 0) {
      // Map serviceList to array of values for bulk insertion
      const serviceValues = parsedServiceList.map((service) => [
        userId,         // profileId from the inserted profile
        service.name,      // service name
        service.price,     // service price
        service.aboutService, // about service
        service.image      // imagePath (assuming this is where the image is stored)
      ]);

      // Insert services into the database
      profileModel.insertServices(serviceValues, (err, result) => {
        if (err) {
          console.error("Error inserting services:", err);
          return res.status(500).json({ error: "Database insertion error" });
        }
        res.status(200).json({ message: "Profile and services saved successfully" });
      });
    } else {
      // No services to insert
      res.status(200).json({ message: "Profile saved successfully" });
    }
  });
};

module.exports = {
  setupProfile,
};
