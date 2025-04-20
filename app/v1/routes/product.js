const express = require("express"); // ייבוא Express
const {
  GetAll,
  GetByID,
  AddNew,
  UpdateByID,
  DeletByID,
} = require("../controllers/product"); // ייבוא הפונקציות מה-controller של מוצרים

const router = express.Router(); // יצירת router חדש

// ✅ קבלת כל המוצרים
router.get("/", GetAll); // GET /product

// ✅ קבלת מוצר לפי מזהה (pid)
router.get("/:id", GetByID); // GET /product/:id

// ✅ הוספת מוצר חדש
router.post("/", AddNew); // POST /product

// ✅ עדכון מוצר לפי מזהה
router.put("/:id", UpdateByID); // PUT /product/:id

// ✅ מחיקת מוצר לפי מזהה
router.delete("/:id", DeletByID); // DELETE /product/:id

module.exports = router; // ייצוא ה-router לשימוש ב-app.js
