require('dotenv').config();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.env.UPLOADS_DIR}${req.path === '/' ? req.baseUrl.split('/api/v1/')[1] : req.path.split('/')[1]}/`);
  },
  filename: function (req, files, cb) {
    cb(null, (req.params.id || `${Math.random().toString(36).substring(2)}`) + '-' + Date.now() + path.extname(files.originalname));
  }
});

const fileFilter = (req, files, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mkv/;
  const extname = allowedTypes.test(path.extname(files.originalname).toLowerCase());
  const mimetype = allowedTypes.test(files.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: media type not allowed!');
  }
};

const upload = multer({
  storage,
  // fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 } // Limit file size to 200MB
});

module.exports = { upload };
