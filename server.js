require('dotenv').config(); // טוען משתני סביבה מתוך קובץ .env

const http = require('http'); // ייבוא המודול המובנה של Node.js ליצירת שרת HTTP
const app = require('./app'); // ייבוא האפליקציה הראשית (שנכתבה בקובץ app.js)
const open = require('open'); // ייבוא מודול 'open' – מאפשר פתיחת דפים בדפדפן

const Server = http.createServer(app); // יצירת שרת HTTP שמריץ את האפליקציה שלנו

const PORT = process.env.PORT || 3030; // קובע את הפורט לפי קובץ .env או ברירת מחדל (3030)

Server.listen(PORT, () => {
    console.log(`Server started on ${PORT}`); // מדפיס הודעה ששרת עלה
    open(`http://localhost:${PORT}/login`); // פותח אוטומטית את דף ההתחברות בדפדפן
});
