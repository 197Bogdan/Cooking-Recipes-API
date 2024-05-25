const express = require('express');
const router = express.Router();

const { UploadedImage } = require('../models');
const { authenticateToken } = require('../middlewares/authenticateToken');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_DIR); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});
const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   - name: Images
 *     description: Operations related to images
 */

/**
    * @swagger
    * /images:
    *   get:
    *     summary: Get all images uploaded by the user
    *     tags: [Images]
    *     description: Get all images uploaded by the user
    *     responses:
    *       200:
    *         description: OK
    *       500:
    *         description: Internal server error
    */
router.get('/', authenticateToken, async (req, res) => {
  const images = await UploadedImage.findAll({ where: { userId: req.user.userId } });
  res.json(images);
});


/**
    * @swagger
    * /images/upload:
    *   post:
    *     summary: Upload an image
    *     tags: [Images]
    *     description: Upload an image
    *     security:
    *       - bearerAuth: []
    *     consumes:
    *       - multipart/form-data
    *     parameters:
    *       - in: formData
    *         name: image
    *         type: file
    *         description: The image to upload
    *     responses:
    *       200:
    *         description: OK
    *       500:
    *         description: Internal server error
    */
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  console.log(req.file);
  const filename = req.file.filename; 
  await UploadedImage.create({ filename, userId: req.user.userId });
  res.json({ success: true, message: 'Image uploaded successfully', filename: filename });
});

module.exports = router;
