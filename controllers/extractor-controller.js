const extractorService = require('../services/extractor-service');
const path = require('path');
const multer = require('multer');

const create = async (req, res) => {
    const result = await extractorService.create();
    res.send(result);
}
const download = (req, res) =>{
    const file = path.resolve(__dirname, '../export', "הרב מרציאנו.csv"); // הנתיב לקובץ
    res.download(file); // שליחת הקובץ
}
// קבלת הקובץ מהלקוח ושמירתו בתיקית היבוא
const upload = (req, res) =>{
    const upload = multer({ dest: 'uploads/' });  // שמור את הקבצים בתיקייה 'uploads'
    upload.single('file'); // הגדרת שם הקובץ
    console.log(req.file);
    console.log("upload");
    // console.log(req.files);
    // if(req.file){
    //     let file = req.files.file;
    //     let fileName = file.name;
    //     file.mv('./import/' + fileName, function(err){
    //         if(err){
    //             console.log(err);
    //             res.send('error occured');
    //         }
    //         else{
    //             res.send('Done!');
    //             console.log("Done!");
    //         }
        // })
    // }
}


module.exports = {
    create, 
    download,
    upload
}