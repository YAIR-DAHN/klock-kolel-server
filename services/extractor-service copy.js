const fs = require('fs');
const path = require('path');
const listName = JSON.parse(fs.readFileSync('./import/nameList.json', 'utf8')); // קבלת רשימת האברכים
const { HDate } = require('@hebcal/core'); // ייבוא חבילת תאריכים עבריים


const create = async (req, res) => {
    let userName;
    const openFile = async (filePath) => {
        let content = fs.readFileSync(path.resolve(__dirname, filePath), { encoding: 'utf8', flag: 'r' });
        return content;
    }

    let fileName = '../import/abc.dat';
    let r = openFile(fileName);
    let lines = r.split('\n'); // הכלת כל שורה כמערך

    // הסרת רווחים מההתחלה + שבירה לפי טאבים ורווחים + הסרת העמודות האחרונות
    let data = lines.map(line => line.trimStart().split(/[\t ]/).slice(0, -2));


    let idData = {};

    for (let line of data) {
        let idValue = line[0];

        // בדיקה האם קיים כבר מערך עבור האברך
        if (!idData[idValue]) {
            // יצירת מערך ראשוני עבור האברך (משמש ככותרת)
            idData[idValue] = [["תאריך", "ת. עברי", "יום", "כניסה 1", "", "יציאה 1", "", "כניסה 2", "", "יציאה 2", "", "כניסה 3", "", "יציאה 3"]];
        }

        // בדיקה האם קיים כבר תאריך זהה לאברך, אם לא קיים הוספת התאריך והשעות
        if (idData[idValue].findIndex(findDate) === -1) {
            let data = line.slice(1);

            // איתור התאריך העברי
            let dateFormat;
            if (data[0] != undefined) {
                dateFormat = data[0].split('-');
            }
            else continue;

            let hebDate = new HDate(new Date(dateFormat[0], dateFormat[1] - 1, dateFormat[2]));

            // דחיפת תאריך עברי ולועזי ושם היום למערך האברך
            idData[idValue].push(data = [line[1], hebDate.renderGematriya(true), getDayString(hebDate.getDay())]);

            // בדיקה האם לא דווח כניסה
            let currentLine = idData[idValue][idData[idValue].length - 1];
            if (line[4] === '1') {
                currentLine.push("לא דווח", 2);
            }

            //דחיפת השעות למערך האברך
            currentLine.push(line[2], line[4]);

        }

        // התנהגות במצב והתאריך כבר קיים 
        else {
            let index = idData[idValue].findIndex(findDate); // מציאת האינדקס של התאריך הקיים
            let currentLine = idData[idValue][index];

            // בדיקה האם יש פער של לפחות 20 דקות בין השעות
            if (isTimeAfter(line[2], currentLine[currentLine.length - 2])) {

                // בדיקה האם הפעולה האחרונה היא כניסה או יציאה לאיתור כניסות או יציאו שלא דווחו
                if (currentLine[currentLine.length - 1] == line[4]) {
                    currentLine.push("לא דווח", 2);
                }
                currentLine.push(line[2], line[4]);
            }

            // במידה ואין פער של לפחות 20 דקות בין השעות הערך החדש ידרוס את הערך הקודם
            else {

                //למקרה שהפעולה האחונה יצרה סימון של לא דווח
                if (currentLine[currentLine.length - 4] == 'לא דווח') {
                    currentLine.slice(0, -2);
                }
                currentLine[currentLine.length - 2] = line[2];
                currentLine[currentLine.length - 1] = line[4];
            }
        }

        function findDate(arry) {

            return arry[0] === line[1]
        }

        //פונקציה לבדיקת פער בין השעות
        function isTimeAfter(time1, time2) {
            let date1 = new Date(`1970-01-01T${time1}Z`);
            let date2 = new Date(`1970-01-01T${time2}Z`);
            date2.setMinutes(date2.getMinutes() + 20);
            // console.log(`date1: ${date1} date2: ${date2}`);
            return date1 > date2;
        }

        // פונקציה להמרת מספר היום לשם היום
        function getDayString(day) {
            switch (day) {
                case 0:
                    return "ראשון";
                case 1:
                    return "שני";
                case 2:
                    return "שלישי";
                case 3:
                    return "רביעי";
                case 4:
                    return "חמישי";
                case 5:
                    return "שישי";
                case 6:
                    return "שבת";
            }
        }
    }



    for (let idValue in idData) {

        // איתור שם האברך
        function getUserById(id) {
            let user = listName.find(user => user.id === id);
            // console.log(id);
            return user ? user.name : null;
        }

        userName = Number(idValue) > 0 ? getUserById(Number(idValue)) : console.log("finish");;// קבלת שם האברך לפי המספר שלו
        let csvFileName = `${userName}.csv`; // יצירת שם קובץ עבור כל אברך


        // idData[idValue].forEach(i => {
        //     i[3] == "0" ? i[3] = "כניסה" : i[3] = "יציאה";
        // }); // כניסה ויציאה במקום 0 ו-1

        let csvContent = idData[idValue].map(line => line.join(',')).join('\n'); // יצירת תוכן הקובץ

        fs.writeFileSync(path.resolve(__dirname, '../export', csvFileName), csvContent); // יצירת הקובץ
    }

    return await userName;
}

module.exports = {
    create
}