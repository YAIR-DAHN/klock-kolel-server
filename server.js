const express = require('express');
const path = require('path');
const extractorRouter = require('./routers/extractor-routers');
const cors  = require('cors');
const app = express();
app.use(cors());

const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});
// app.get('/download', function(req, res){
//     const file = path.resolve(__dirname, './export', "הרב מרציאנו.csv"); // הנתיב לקובץ
//     res.download(file); // שליחת הקובץ
// });
app.use('/extractor', extractorRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
