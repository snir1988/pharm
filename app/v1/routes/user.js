const express = require("express"); // ייבוא Express ליצירת ראוטר
const {
  loginPage,
  login,
  register,
  logout,
  ShowForgotPasswordPage,
  SendResetEmail,
  ShowResetForm,
  UpdatePassword
} = require("../controllers/user"); // ייבוא כל הפונקציות מה-controller של משתמשים

const authMiddleware = require("../middelewares/auth"); // ✅ ייבוא מידלוור לבדיקה אם המשתמש מחובר

const router = express.Router(); // יצירת אובייקט router

// ✅ GET - הצגת עמוד ההתחברות
router.get("/login", loginPage); // טוען את views/auth/login.ejs

// ✅ POST - התחברות משתמש
router.post("/login", login); // מקבל את טופס ההתחברות ומבצע אימות

// ✅ GET - הצגת עמוד הרישום
router.get("/register", (req, res) => {
  res.render("auth/register", { msg: null, error: false }); // מציג טופס רישום ריק בהתחלה
});

// ✅ POST - שליחת טופס רישום
router.post("/register", register); // מבצע רישום בפועל

// ✅ GET - התנתקות משתמש (רק אם מחובר)
router.get("/logout", authMiddleware, logout); // משתמש במידלוור כדי לוודא שהמשתמש מחובר

// ✅ GET - הצגת עמוד 'שכחתי סיסמה'
router.get("/forgot-password", ShowForgotPasswordPage); // טוען את views/auth/forgot-password.ejs

// ✅ POST - שליחת מייל איפוס סיסמה
router.post("/forgot-password", SendResetEmail); // שליחת טוקן לאיפוס למייל

// ✅ GET - הצגת טופס איפוס סיסמה לפי טוקן
router.get("/reset-password/:token", ShowResetForm); // טוען את views/auth/reset-password.ejs

// ✅ POST - שליחת סיסמה חדשה לאחר איפוס
router.post("/reset-password", UpdatePassword); // משנה את הסיסמה במסד הנתונים

module.exports = router; // ייצוא ה-router לשימוש ב-app.js
