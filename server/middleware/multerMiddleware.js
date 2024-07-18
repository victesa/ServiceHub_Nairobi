const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './server/images'); // Relative path to the 'images' folder
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "images/");
    }
});
  
  

// Initialize upload
const upload = multer({ storage: storage });

module.exports = upload;
