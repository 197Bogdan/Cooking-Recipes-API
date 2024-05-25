const express = require('express');
const router = express.Router();

const { UploadedImage } = require('../models');
const { authenticateToken } = require('../middlewares/authenticateToken');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});
const upload = multer({ storage: storage });


router.get('/', authenticateToken, async (req, res) => {
  const images = await UploadedImage.findAll({ where: { userId: req.user.userId } });
  res.json(images);
});

router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  console.log(req.file);
  const filename = req.file.filename; 
  await UploadedImage.create({ filename, userId: req.user.userId });
  res.json({ success: true, message: 'Image uploaded successfully', filename: filename });
});

module.exports = router;
