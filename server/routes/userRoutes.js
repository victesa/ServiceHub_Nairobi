const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateUser = require('../middleware/validateUser');
const upload = require('../middleware/multerMiddleware'); // Assuming this is correct

const profileController = require("../controllers/ProfileController");
const getUserIdFromSession = require('../middleware/userIdSession');


  

// Other routes
router.post('/signIn', userController.signInUserController);
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', validateUser, userController.resetPassword);
router.post('/register', validateUser, userController.registerUser);
router.get('/verify-email', userController.verifyUserEmail);

module.exports = router;
