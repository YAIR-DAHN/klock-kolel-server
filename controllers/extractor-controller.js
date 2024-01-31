const extractorService = require('../services/extractor-service');
const path = require('path');
const multer = require('multer');

const create = async (req, res) => {
    try {
        const result = await extractorService.create();
        nameList = getList();
        res.send(result);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}
const download = (req, res) => {
    const file = path.resolve(__dirname, '../export', "הרב מרציאנו.csv"); // הנתיב לקובץ
    res.download(file); // שליחת הקובץ
}
// קבלת הקובץ מהלקוח ושמירתו בתיקית היבוא
const upload = (req, res) => {
    try {
        const upload = multer({ dest: 'uploads/' });  // שמור את הקבצים בתיקייה 'uploads'
        upload.single('file'); // הגדרת שם הקובץ
        res.sendStatus(200);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}
const getList = () => {
    const fs = require('fs');
    const path = require('path');

    function getFileNames(directoryPath) {
        const absolutePath = path.resolve(__dirname, directoryPath);
        return fs.readdirSync(absolutePath);
    }

    // שימוש בפונקציה
    const fileNames = getFileNames('../export');
    console.log(fileNames);
    return fileNames;
}

module.exports = {
    create,
    download,
    upload
}