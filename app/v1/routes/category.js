const express = require("express"); // ייבוא express
const {
  GetAll,
  GetByID,
  AddNew,
  UpdateByID,
  DeletByID,
} = require("../controllers/category"); // ייבוא הפונקציות מה-controller של קטגוריות

const router = express.Router(); // יצירת router חדש

// ✅ קבלת כל הקטגוריות
router.get("/", GetAll); // GET /category

// ✅ קבלת קטגוריה לפי מזהה
router.get("/:id", GetByID); // GET /category/:id

// ✅ הוספת קטגוריה חדשה
router.post("/", AddNew); // POST /category

// ✅ עדכון קטגוריה לפי מזהה
router.put("/:id", UpdateByID); // PUT /category/:id

// ✅ מחיקת קטגוריה לפי מזהה
router.delete("/:id", DeletByID); // DELETE /category/:id

module.exports = router; // ייצוא ה-router לשימוש בקובץ app.js
