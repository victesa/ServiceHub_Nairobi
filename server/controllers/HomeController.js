const serviceModel = require("../models/SeviceModel");

function getHomeDetails(req, res) {
    const userId  = req.session.userId;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    const homeDetails = {};

    serviceModel.getAllServicesOfServiceProvider(userId, (err, services) => {
        if (err) {
            console.error("Error fetching services:", err);
            return res.status(500).json({ error: "Error fetching services" });
        }

        if (services.message) {
            homeDetails.services = [];
        } else {
            homeDetails.services = services;
        }

        // Fetch user details after fetching services
        serviceModel.getUserDetails(userId, (err, userDetails) => {
            if (err) {
                console.error("Error fetching user details:", err);
                return res.status(500).json({ error: "Error fetching user details" });
            }

            if (userDetails.message) {
                homeDetails.userDetails = {};
            } else {
                homeDetails.userDetails = userDetails;
            }

            // Send the combined data as a JSON response
            res.status(200).json(homeDetails);
        });
    });
}

module.exports = {
    getHomeDetails,
};
