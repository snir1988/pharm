const express = require("express"); // ייבוא Express ליצירת ראוטר
const {
  loginPage,
  login,
  register,
  logout
} = require("../controllers/user"); // ייבוא הפונקציות מה-controller של משתמשים

const authMiddleware = require("../middelewares/auth"); // ✅ ייבוא מידלוור לבדיקה אם המשתמש מחובר

const router = express.Router(); // יצירת אובייקט router

// ✅ GET - הצגת עמוד ההתחברות
router.get("/login", loginPage); // טוען את views/auth/login.ejs

// ✅ POST - התחברות משתמש
router.post("/login", login); // מקבל את טופס ההתחברות ומבצע אימות

// ✅ GET - הצגת עמוד הרישום
router.get("/register", (req, res) => {
  res.render("auth/register", { msg: null, error: false }); // מציג טופס ריק בהתחלה
});

// ✅ POST - שליחת טופס רישום
router.post("/register", register); // מבצע רישום בפועל

// ✅ GET - יציאת משתמש (דורש התחברות)
router.get("/logout", authMiddleware, logout); // משתמש במידלוור כדי לוודא שהמשתמש מחובר

module.exports = router; // ייצוא ה-router לשימוש ב-app.js
