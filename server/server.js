const express = require('express');
const { json, urlencoded } = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const userRoutes = require('./routes/userRoutes');
const { getHomeDetails } = require('./controllers/HomeController');
const getAllRequestsForServiceProvider = require('./controllers/RequestController');
const { setupProfile } = require('./controllers/ProfileController');
const { updateProfile } = require('./models/ProfileModel');
const getUserIdFromSession = require('./middleware/userIdSession');
const db = require('./config/db');
const nodemailer = require('nodemailer')
const crypto = require("crypto")
const bcrypt = require('bcrypt');

const sessionStore = new session.MemoryStore();
const app = express();
const twoDaysMilliseconds = 172800000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(urlencoded({ extended: true }));
app.use(json());

app.use(session({
  key: 'user_sid',
  secret: 'your_secret_key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: twoDaysMilliseconds,
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware to extract serviceId
function extractServiceId(req, res, next) {
  console.log("hi")
  const { serviceId } = req.body;
  if (!serviceId) {
    console.log(req.body)
    return res.status(400).json({ error: 'Service ID not provided.' });
  }
  req.serviceId = serviceId;
  console.log(req.serviceId)
  next();
}

// POST endpoint to add a service
app.post('/addService', (req, res) => {
  const { serviceName, price, aboutService } = req.body;

  const query = "INSERT INTO services (provider_id, name, starting_price, about_service) VALUES (?, ?, ?, ?)";
  const userId = req.session.userId; // Assuming userId is stored in session

  db.query(query, [userId, serviceName, price, aboutService], (err, result) => {
    if (err) {
      console.error("Failed to add service:", err);
      return res.status(500).json({ error: 'Failed to add service' });
    }

    const insertedServiceId = result.insertId; // Get the ID of the newly inserted service

    res.status(200).json({ serviceId: insertedServiceId });
  });
});

app.post('/signUp', (req, res) =>{
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
    })});


// POST endpoint to handle image upload
app.post('/imageUpload', upload.single('image'), (req, res) => {
  const { serviceId } = req.body;
  const { path: imagePath } = req.file;

  console.log('Service ID:', serviceId); // Check if serviceId is correctly logged
  console.log('Image Path:', imagePath); // Check if imagePath is correctly logged

  const query = 'UPDATE services SET image = ? WHERE service_id = ?';
  const values = [imagePath, serviceId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Failed to upload image:", err);
      return res.status(500).json({ error: err });
    }

    console.log('Database Update Result:', result); // Check the database update result

    res.status(200).json({ message: 'Image uploaded successfully', result });
  });
});

function extractUserData(req, res, next) {
  req.userId = req.session.userId;
  req.bio = req.body.bio;

  if (!req.userId) {
    return res.status(400).json({ error: 'User ID not found in session.' });
  }

  next();
}

app.post('/profileUpload', upload.single('profileImage'), (req, res) => {
  const { firstName, lastName, location, aboutService } = req.body;
  const { userId } = req.session;
  const bio = req.body.bio;

  if (!req.file) {
    return res.status(400).json({ error: "No Image Uploaded" });
  }

  const profileImagePath = req.file.path;

  const query = "UPDATE users SET profilePic = ?, first_name = ?, last_name = ?, location = ?, bio = ? WHERE userId = ?";

  db.query(query, [profileImagePath, firstName, lastName, location, userId, aboutService], (err, result) => {
    if (err) {
      console.error("Error updating user info:", err);
      return res.status(500).json({ error: 'Error updating user info.' });
    }

    updateProfile(userId, profileImagePath, bio, (err) => {
      if (err) {
        console.error("Error updating profile:", err);
        return res.status(400).json({ error: 'Error updating profile.' });
      }
      res.status(200).json({ message: 'Profile updated successfully.' });
    });
  });
});


app.post('/deleteBooking', (req, res) => {
  const { booking_id, clientName, serviceName, client_id } = req.body;

  const query = "DELETE FROM bookings WHERE booking_id = ?";

  db.query(query, [booking_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }

    // After deletion, fetch the client's email
    db.query("SELECT email FROM users WHERE userId = ?", [client_id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: err });
      }

      if (results.length > 0) {
        const clientEmail = results[0].email;
        DeleteBooking(clientEmail, serviceName, clientName);
        res.status(200).json({ message: "Booking deleted and email sent" });
      } else {
        res.status(400).json({ error: "Client not found" });
      }
    });
  });
});

function DeleteBooking(clientEmail, serviceName, clientName) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "kirui6623@gmail.com",
      pass: 'vsgx bfsn inzz eyaz',
    },
  });

  const mailOptions = {
    from: "kirui6623@gmail.com",
    to: clientEmail,
    subject: 'Booking Canceled',
    html: `<p>Hello ${clientName},<br><br>A service provider has unfortunately canceled your booking for service ${serviceName}. You can, however, request another service from another provider.<br><br>Regards,<br>ServiceHub</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}


app.get("/serviceProviderRequest", (req, res) => {
  const userId = req.session.userId;

  // Query to fetch request data including additional fields from users and services tables
  const query = `
    SELECT 
      r.*, 
      u.profilePic, 
      CONCAT(u.first_name, ' ', u.last_name) AS full_name,
      s.name AS service_name,
      TIMESTAMPDIFF(HOUR, NOW(), r.deadline) AS hours_remaining 
    FROM 
      requests r
      JOIN users u ON r.client_id = u.userId
      JOIN services s ON r.service_id = s.service_id
    WHERE 
      r.client_id = ?
  `;

  // Execute the query with userId as parameter
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Process the results and calculate remaining hours
    const requestsWithDetails = results.map(request => {
      const { deadline } = request;
      const hoursRemaining = moment(deadline).diff(moment(), 'hours'); // Calculate hours remaining

      return {
        ...request,
        hours_remaining: hoursRemaining
      };
    });

    // Send the processed data to the frontend
    res.status(200).json({ requests: requestsWithDetails });
  });
});

app.get('/viewSpecificWork', (req, res) => {
  const { userId } = req.session;
  const { booking_id } = req.query; // Assuming booking_id is passed as a query parameter

  // Query to fetch request data including additional fields from users and services tables
  const query = `
    SELECT 
      b.*, 
      u.profilePic, 
      CONCAT(u.first_name, ' ', u.last_name) AS full_name,
      s.name AS service_name
    FROM 
      bookings b
      JOIN users u ON b.provider_id = u.userId
      JOIN services s ON b.provider_id = s.provider_id
    WHERE 
      b.booking_id = ? AND
      b.provider_id = ?
    LIMIT 1
  `;

  // Execute the query with booking_id and userId as parameters
  db.query(query, [booking_id, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: err.message });
    }

    // Check if results exist and ensure bookings is always an array
    const booking = results.length > 0 ? results[0] : null;

    // Send the processed data to the frontend
    res.status(200).json({ booking });
  });
});

// Endpoint to fetch work
app.get('/fetchWork', (req, res) => {
  // Assuming userId is obtained from session
  const userId = req.session.userId; // Adjust as per your authentication/session setup

  // Query logic to fetch work
  const query = `
    SELECT bookings.*, CONCAT(users.first_name, ' ', users.last_name) AS providerName
    FROM bookings
    LEFT JOIN users ON bookings.provider_id = users.userId
    WHERE bookings.client_id = ?
    AND bookings.booking_date > NOW()
    AND (bookings.isRated = false OR bookings.isRated IS NULL)
    ORDER BY bookings.booking_date ASC
  `;

  // Execute query using your MySQL db.query method
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching work:', err);
      res.status(500).json({ error: 'Failed to fetch work' });
    } else {
      res.json(results);
    }
  });
});

// Endpoint to rate service
app.post('/rate', (req, res) => {
  const { bookingId } = req.body;

  // Update query to mark service as rated
  const updateQuery = `
    UPDATE bookings
    SET isRated = true
    WHERE id = ?
  `;

  // Execute update query using your MySQL db.query method
  db.query(updateQuery, [bookingId], (err, result) => {
    if (err) {
      console.error('Error rating service:', err);
      res.status(500).json({ error: 'Failed to rate service' });
    } else {
      res.json({ message: 'Service rated successfully' });
    }
  });
});


app.get("/viewSpecificRequest", (req, res) => {
  const { userId } = req.session;
  const { request_id } = req.query; // Assuming request_id is passed as a query parameter

  console.log(request_id);
  console.log(userId);

  // Query to fetch request data including additional fields from users and services tables
  const query = `
    SELECT 
      r.*, 
      u.profilePic, 
      CONCAT(u.first_name, ' ', u.last_name) AS full_name,
      u.ratings,
      s.name AS service_name
    FROM 
      requests r
      JOIN users u ON r.provider_id = u.userId
      JOIN services s ON r.service_id = s.service_id
    WHERE 
      r.request_id = ? AND
      r.client_id = ?
  `;

  // Execute the query with request_id and userId as parameters
  db.query(query, [request_id, userId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }

    console.log(results);

    // Send the processed data to the frontend
    res.status(200).json({ requests: results });
  });
});

app.get("/viewSpecificOrder", (req, res) => {
  const { userId } = req.session;
  const { request_id, provider_id } = req.query; // Assuming request_id is passed as a query parameter


  // Query to fetch request data including additional fields from users and services tables
  const query = `
    SELECT 
      r.*, 
      u.profilePic, 
      CONCAT(u.first_name, ' ', u.last_name) AS full_name,
      u.ratings,
      s.name AS service_name
    FROM 
      requests r
      JOIN users u ON r.provider_id = u.userId
      JOIN services s ON r.service_id = s.service_id
    WHERE 
      r.request_id = ? AND
      u.userId = ?
  `;

  // Execute the query with request_id and userId as parameters
  db.query(query, [request_id, provider_id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }

    // Assuming results is an array with a single object, send the first item.
    const request = results.length > 0 ? results[0] : null;

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Send the processed data to the frontend
    res.status(200).json({ request });
  });
});


app.post('/updateRequest', (req, res) => {
  const { providerId, date, orderDetails, phoneNumber } = req.body;
  const { userId } = req.session;

  const query = "UPDATE requests SET message = ?, booking_date = ?, client_contact_details = ? WHERE client_id = ? AND provider_id = ?";

  db.query(query, [orderDetails, date, phoneNumber, userId, providerId], (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    console.log(result)

    res.status(200).json({ message: "Ok" });
  });
});

app.post('/deleteRequest', (req, res) => {
  const { request_id } = req.body;

  console.log(request_id);

  const query = "DELETE FROM requests WHERE request_id = ?";

  db.query(query, [request_id], (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    console.log(result);

    res.status(200).json({ message: "Ok" });
  });
});




app.post('/rejectRequest', (req, res) => {
  const { request_id, client_id, service_name } = req.body;
  const { userId } = req.session;

  console.log(req.body);

  // Fetch client details
  const selectQueryClient = "SELECT email, first_name FROM users WHERE userId = ?";
  db.query(selectQueryClient, [client_id], (err, clientResults) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }

    if (clientResults.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    const clientEmail = clientResults[0].email;
    const clientFirstName = clientResults[0].first_name;

    // Fetch service provider details
    const selectQueryServiceProvider = "SELECT first_name, last_name FROM users WHERE userId = ?";
    db.query(selectQueryServiceProvider, [userId], (err, providerResults) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
      }

      if (providerResults.length === 0) {
        return res.status(404).json({ error: "Service provider not found" });
      }

      const serviceProviderFirstName = providerResults[0].first_name;
      const serviceProviderLastName = providerResults[0].last_name;
      const serviceProviderNames = `${serviceProviderFirstName} ${serviceProviderLastName}`;

      // Delete request
      const deleteQuery = "DELETE FROM requests WHERE request_id = ?";
      db.query(deleteQuery, [request_id], (err, deleteResults) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: err.message });
        }

        // Send rejection email
        RejectedOrderRequestEmail(clientEmail, clientFirstName, serviceProviderNames, service_name);

        res.json({ message: "ok" });
      });
    });
  });
});

function RejectedOrderRequestEmail(clientEmail, clientName, serviceProviderName, serviceName) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "kirui6623@gmail.com",
      pass: 'vsgx bfsn inzz eyaz',
    },
  });

  const mailOptions = {
    from: "kirui6623@gmail.com",
    to: clientEmail,
    subject: 'Service Request Declined',
    html: `<p>Hello ${clientName},<br><br>${serviceProviderName} has unfortunately declined your request for the ${serviceName}. You can, however, request another service from another provider.<br><br>Regards,<br>ServiceHub</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}


app.post('/acceptRequest', (req, res) => {
  const { request_id, client_id, service_name, booking_date, message, client_contact_details } = req.body;
  const { userId } = req.session;

  console.log(req.body);

  // Fetch client details
  const selectQueryClient = "SELECT email, first_name FROM users WHERE userId = ?";
  db.query(selectQueryClient, [client_id], (err, clientResults) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }

    if (clientResults.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    const clientEmail = clientResults[0].email;
    const clientFirstName = clientResults[0].first_name;
    console.log("client successful")


    // Fetch service provider details
    const selectQueryServiceProvider = "SELECT first_name, last_name FROM users WHERE userId = ?";
    db.query(selectQueryServiceProvider, [userId], (err, providerResults) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
      }

      if (providerResults.length === 0) {
        return res.status(404).json({ error: "Service provider not found" });
      }

      const serviceProviderFirstName = providerResults[0].first_name;
      const serviceProviderLastName = providerResults[0].last_name;
      const serviceProviderNames = `${serviceProviderFirstName} ${serviceProviderLastName}`;
      console.log("service provider successful")

      // Delete request
      const deleteQuery = "DELETE FROM requests WHERE request_id = ?";
      db.query(deleteQuery, [request_id], (err, deleteResults) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: err.message });
        }

      console.log("delete successful")


        // Insert into bookings
        const insertBookings = "INSERT INTO bookings (client_id, provider_id, service_name, booking_details, client_contact_details, booking_date) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(insertBookings, [client_id, userId, service_name, message, client_contact_details, booking_date], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(400).json({ error: err.message });
          }

          sendAcceptedOrderRequestEmail(clientEmail, clientFirstName, serviceProviderNames, service_name);

          res.json({ message: "ok" });
        });
      });
    });
  });
});

function sendAcceptedOrderRequestEmail(clientEmail, clientName, serviceProviderName, serviceName) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "kirui6623@gmail.com",
      pass: 'vsgx bfsn inzz eyaz',
    },
  });

  const mailOptions = {
    from: "kirui6623@gmail.com",
    to: clientEmail,
    subject: 'Service Request Accepted',
    html: `<p>Hello ${clientName},<br><br>${serviceProviderName} has accepted your request for the ${serviceName}. We have shared your contact details with them. Expect them to reach out.<br><br>Regards,<br>ServiceHub</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}


app.get('/upcomingWork', (req, res) => {
  const { userId } = req.session;
  
  const query = `
    SELECT 
      b.service_name AS service,
      b.booking_id AS booking_id,
      DATE_FORMAT(b.booking_date, '%d/%m/%Y') AS dueDate,
      u.first_name,
      u.last_name,
      u.profilePic
    FROM bookings b
    JOIN users u ON b.client_id = u.userId
    WHERE b.provider_id = ? AND b.booking_date >= CURDATE()
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }
    
    const formattedResults = results.map(result => ({
      name: `${result.first_name} ${result.last_name}`,
      service: result.service,
      dueDate: result.dueDate,
      profilePic: result.profilePic,
      booking_id: result.booking_id
    }));
    
    res.json(formattedResults);
  });
});

app.get('/ongoingWork', (req, res) =>{
  const { userId } = req.session;

  const query = `
    SELECT 
      b.service_name AS service,
      DATE_FORMAT(b.booking_date, '%d/%m/%Y') AS dueDate,
      u.first_name,
      u.last_name,
      u.profilePic
    FROM bookings b
    JOIN users u ON b.client_id = u.userId
    WHERE b.provider_id = ? AND b.booking_date = CURDATE()
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }
    
    const formattedResults = results.map(result => ({
      name: `${result.first_name} ${result.last_name}`,
      service: result.service,
      dueDate: result.dueDate,
      profilePic: result.profilePic
    }));
    
    res.json(formattedResults);
  });
})

app.get('/history', (req, res) =>{
  const { userId } = req.session;

  const query = `
    SELECT 
      b.service_name AS service,
      DATE_FORMAT(b.booking_date, '%d/%m/%Y') AS dueDate,
      u.first_name,
      u.last_name,
      u.profilePic
    FROM bookings b
    JOIN users u ON b.client_id = u.userId
    WHERE b.provider_id = ? AND b.booking_date <= CURDATE()
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }
    
    const formattedResults = results.map(result => ({
      name: `${result.first_name} ${result.last_name}`,
      service: result.service,
      dueDate: result.dueDate,
      profilePic: result.profilePic
    }));
    
    res.json(formattedResults);
  });
})

app.get('/fetchOrders', (req, res) => {
  const { userId } = req.session;

  const query = "SELECT service_id, provider_id, booking_date, request_id FROM requests WHERE client_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ error: "Error fetching orders" });
    }

    // If no results found for the user
    if (results.length === 0) {
      return res.status(404).json({ message: 'No orders found for the user' });
    }

    const promises = results.map(result => {
      const serviceQuery = "SELECT name FROM services WHERE service_id = ?";
      const providerQuery = "SELECT first_name, last_name FROM users WHERE userId = ?";

      return new Promise((resolve, reject) => {
        // Fetch service_name for the service_id
        db.query(serviceQuery, [result.service_id], (err, serviceResult) => {
          if (err) {
            console.error("Error fetching service name:", err);
            return reject(err);
          }

          // Fetch first_name and last_name for the provider_id
          db.query(providerQuery, [result.provider_id], (err, providerResult) => {
            if (err) {
              console.error("Error fetching provider details:", err);
              return reject(err);
            }

            const serviceName = serviceResult.length > 0 ? serviceResult[0].name : 'Unknown Service';
            const providerName = providerResult.length > 0 ? `${providerResult[0].first_name} ${providerResult[0].last_name}` : 'Unknown Provider';

            const orderDetails = {
              serviceName: serviceName,
              providerName: providerName,
              bookingDate: result.booking_date,
              serviceId: result.service_id,
              request_id: result.request_id,
              provider_id: result.provider_id
            };

            resolve(orderDetails);
          });
        });
      });
    });

    Promise.all(promises)
      .then(orderDetails => {
        res.json(orderDetails);
      })
      .catch(error => {
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Error fetching order details" });
      });
  });
});


app.use('/auth', userRoutes);

app.get('/protect', (req, res) => {
  if (req.session && req.session.authenticated) {
    const { userId, username, role } = req.session;
    res.json({ authenticated: true, userId, username, role });
  } else {
    res.status(401).json({ authenticated: false, message: 'Unauthorized' });
  }
});

app.get('/userId', (req, res) => {
  const userId = req.session.userId;
  res.json({ userId });
});

app.post('/clientHomeScreen', getHomeDetails);

app.post('/logOut', (req, res) => {
  req.session.authenticated = false;
  req.session.role = null;
  req.session.userId = null;

  res.status(200).json({ msg: "ok" });
});

app.post('/protectedRoute', (req, res) => {
  if (req.session && req.session.authenticated) {
    const { userId, username, role } = req.session;
    res.json({ authenticated: true, userId, username, role });
  } else {
    res.status(401).json({ authenticated: false, message: 'Unauthorized' });
  }
});

app.post('/popularServices', (req, res) => {
  const query = `
    SELECT 
      s.image AS service_image,
      s.name AS service_name,
      u.first_name AS provider_first_name,
      u.last_name AS provider_last_name,
      u.profilePic AS provider_profile_pic,
      u.userId AS provider_Id,
      s.service_id AS service_id,
      s.ratings AS service_ratings,
      s.about_service AS service_description,
      s.starting_price AS service_starting_price,
      son.number AS service_order_count
    FROM 
      services s
    JOIN 
      users u ON s.provider_id = u.userId
    JOIN 
      serviceordernumber son ON s.service_id = son.service_id
    ORDER BY 
      son.number DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ error: err });
    }

    // Format the results into JSON
    const formattedResult = result.map(service => ({
      serviceImage: service.service_image,
      serviceName: service.service_name,
      providerFirstName: service.provider_first_name,
      providerLastName: service.provider_last_name,
      providerProfilePic: service.provider_profile_pic,
      serviceRatings: service.service_ratings,
      serviceDescription: service.service_description,
      serviceStartingPrice: service.service_starting_price,
      serviceOrderCount: service.service_order_count,
      providerId: service.provider_Id,
      service_Id: service.service_id
    }));

    res.json(formattedResult);
  });
});



app.post('/searchServices', (req, res) => {
  const serviceName = req.body.searchParams;
  console.log(serviceName)

  const query = `
    SELECT 
      s.image AS service_image,
      s.name AS service_name,
      u.first_name AS provider_first_name,
      u.last_name AS provider_last_name,
      u.profilePic AS provider_profile_pic,
      u.userId AS provider_Id,
      s.service_id AS service_id,
      s.ratings AS service_ratings,
      s.about_service AS service_description,
      s.starting_price AS service_starting_price
    FROM 
      services s
    JOIN 
      users u ON s.provider_id = u.userId
    WHERE 
      s.name = ?
  `;

  db.query(query, [serviceName], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ error: err });
    }

    // Format the results into JSON
    const formattedResult = result.map(service => ({
      serviceImage: service.service_image,
      serviceName: service.service_name,
      providerFirstName: service.provider_first_name,
      providerLastName: service.provider_last_name,
      providerProfilePic: service.provider_profile_pic,
      serviceRatings: service.service_ratings,
      serviceDescription: service.service_description,
      serviceStartingPrice: service.service_starting_price,
      providerId: service.provider_Id,
      service_Id: service.service_id
    }));

    console.log(formattedResult)

    res.json(formattedResult);
  });
});

app.post('/fetchServices', (req, res) => {
  const { userId } = req.session;

  const query = "SELECT name, service_Id, image FROM services WHERE provider_id = ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Send the results back to the client as a JSON response
    res.json(result);
  });
});

app.post('/deleteService', (req, res) => {
  console.log(req.body); // Leave this as it is for logging purposes

  const { serviceId } = req.body;
  const query = "DELETE FROM services WHERE service_id = ?";

  db.query(query, [serviceId], (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Send a positive response
    res.json({ message: "Service deleted successfully" });
  });
});


app.post('/test', (req, res)=>{
  res.json({body: req.body})
})

app.get('/profilePicture', (req, res) => {
  const { userId } = req.session;

  const query = "SELECT profilePic FROM users WHERE userId = ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }

    if (result.length > 0) {
      // Assuming the profilePic field contains the relative path to the image
      const imagePath = result[0].profilePic;
      const fullImageUrl = `${req.protocol}://${req.get('host')}/${imagePath}`;
      return res.json({ picture: fullImageUrl });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
});



const moment = require('moment'); // Import moment library for date manipulation
const { createUser } = require('./models/userModels');
const { sendVerificationEmail } = require('./utils/sendEmailVerification');

app.post('/sendRequest', (req, res) => {
  const { providerId, serviceId, date, orderDetails, phoneNumber } = req.body;
  const { userId } = req.session;

  // Calculate deadline as two days from the current date
  const deadline = moment().add(2, 'days').format('YYYY-MM-DD');

  // SQL query to insert request into database
  const query = `
    INSERT INTO requests 
      (client_id, provider_id, service_id, message, status, booking_date, deadline, client_contact_details) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the query with parameters
  db.query(query, [userId, providerId, serviceId, orderDetails, "Pending", date, deadline, phoneNumber], (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    res.status(200).json({ message: "OK" });
  });
});



app.post('/updateService', upload.single('image'), (req, res) => {
  const { serviceName, price, aboutService, serviceId } = req.body;
  const image = req.file ? req.file.filename : null;

  let query;
  let queryParams;
  console.log("Access 1")

  if (image !== null) {
  console.log("Access 2")

    // Update query with image
    query = "UPDATE services SET name = ?, starting_price = ?, about_service = ?, image = ? WHERE service_id = ?";
    queryParams = [serviceName, price, aboutService, image, serviceId];
  } else {
    // Update query without image
  console.log("Access 3")
    
    query = "UPDATE services SET name = ?, starting_price = ?, about_service = ? WHERE service_id = ?";
    queryParams = [serviceName, price, aboutService, serviceId];
  }

  // Execute the query
  db.query(query, queryParams, (err, result) => {
  console.log("Access 4")

    if (err) {
      console.log(err)
      return res.status(400).json({ error: err.message });
    }
    console.log(result)
    res.status(200).json({ message: "Updated" });
  });
});



app.post('/deleteService', (req, res) => {
  const { serviceId } = req.body;

  const query = "DELETE FROM services WHERE service_id = ?";

  db.query(query, [serviceId], (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(200).json({ message: "Deleted" });
  });
});





const port = 5000;
app.listen(port, () => {
  console.log('Listening on port', port);
});

app.get('/w', (req, res) => {
  res.json(req.session);
});
