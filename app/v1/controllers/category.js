// ייבוא מודל הקטגוריות ממסד הנתונים
const categoryModle = require("../models/category");

module.exports = {
  // פונקציה לקבלת כל הקטגוריות מהמסד והצגתן בדף
  GetAll: (req, res) => {
    try {
      // מבצע חיפוש של כל הקטגוריות במסד הנתונים
      categoryModle.find().then((categories) => {
        // מציג את התבנית 'products/categories' עם רשימת הקטגוריות
        res.render("products/categories", { categories: categories });
      });
    } catch (err) {
      // במקרה של שגיאה, מחזיר תשובת שגיאה 500
      return res.status(500).json({ Msg: "שגיאה בשרת (500)" });
    }
  },

  // פונקציה שמחזירה קטגוריה לפי מזהה (cid)
  GetByID: (req, res) => {
    try {
      // מחפש קטגוריה לפי מזהה שנשלח בפרמטרים של ה-URL
      categoryModle.find({ cid: req.params.id }).then((category) => {
        // מחזיר את הקטגוריה שנמצאה כ-JSON
        return res.status(200).json(category);
      });
    } catch {
      // במקרה של שגיאה, מחזיר תשובת שגיאה 500
      return res.status(500).json({ Msg: "500 server Eror" });
    }
  },

  // פונקציה להוספת קטגוריה חדשה למסד הנתונים
  AddNew: (req, res) => {
    try {
      // מוסיף את הקטגוריה מהבקשה לגוף המסד
      categoryModle.insertMany([req.body]).then((data) => {
        // מחזיר את המידע שנוסף כ-JSON
        return res.status(200).json(data);
      });
    } catch {
      // במקרה של שגיאה, מחזיר תשובת שגיאה 500
      return res.status(500).json({ Msg: "500 server Eror" });
    }
  },

  // פונקציה לעדכון קטגוריה קיימת לפי מזהה
  UpdateByID: (req, res) => {
    try {
      // מבצע עדכון של קטגוריה לפי cid עם הנתונים החדשים שנשלחו בגוף הבקשה
      categoryModle.updateOne({ cid: req.params.id }, req.body).then((data) => {
        // מחזיר את תוצאת העדכון כ-JSON
        return res.status(200).json(data);
      });
    } catch {
      // במקרה של שגיאה, מחזיר תשובת שגיאה 500
      return res.status(500).json({ Msg: "500 server Eror" });
    }
  },

  // פונקציה למחיקת קטגוריה לפי מזהה
  DeletByID: (req, res) => {
    try {
      // מוחק את הקטגוריה לפי מזהה מהפרמטרים
      categoryModle.deleteOne({ cid: req.params.id }).then((data) => {
        // מחזיר את תוצאת המחיקה כ-JSON
        return res.status(200).json(data);
      });
    } catch {
      // במקרה של שגיאה, מחזיר תשובת שגיאה 500
      return res.status(500).json({ Msg: "500 server Eror" });
    }
  },
};
