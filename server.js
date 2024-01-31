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

app.use('/extractor', extractorRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
