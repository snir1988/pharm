const express = require("express"); // ייבוא Express ליצירת ראוטר
const { loginPage, login } = require("../controllers/user"); // ייבוא הפונקציות מבקר המשתמשים

const router = express.Router(); // יצירת ראוטר חדש

// ✅ נתיב להצגת עמוד ההתחברות - GET
router.get("/login", loginPage); // יטען את login.ejs מתוך views (app/v1/views)

// ✅ נתיב להתחברות לאחר שליחת טופס - POST
router.post("/login", login); // פונקציה שמטפלת בנתוני ההתחברות

module.exports = router; // ייצוא ה-router לשימוש בקובץ app.js
