const express = require('express');
const extractorController = require('../controllers/extractor-controller');
const router = express.Router();
const multer = require('multer');
const path = require('path');

router.get('/', extractorController.create);
router.get('/download', extractorController.download);

// קבלת הקובץ מהלקוח ושמירתו בתיקית היבוא
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');  // הגדר את המיקום של הקובץ
    },
    filename: function(req, file, cb) {
      cb(null, "dataInput" + path.extname(file.originalname));  // הגדר את שם הקובץ
    }
  });
  
  const upload = multer({ storage: storage });
  

router.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);  // הדפס את המידע של הקובץ
  res.sendStatus(200);
});

// const upload = multer({ storage: multer.memoryStorage() });

// router.post('/upload', upload.single('file'), (req, res) => {
//   const fileContents = req.file.buffer.toString();  // המר את הקובץ למחרוזת
//   console.log(fileContents);  // הדפס את המחרוזת
//   res.sendStatus(200);
// });


module.exports = router;