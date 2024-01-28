const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const workbook = new ExcelJS.Workbook();
workbook.creator = 'Yair Dahan';
workbook.lastModifiedBy = 'Her';
workbook.created = new Date(2024, 0, 28);
workbook.modified = new Date();
workbook.lastPrinted = new Date(2024, 0, 28);

//הוספת גליון
const sheet = workbook.addWorksheet('גליון 1', {views:[{state: 'frozen', xSplit: 1, ySplit:1}]});
