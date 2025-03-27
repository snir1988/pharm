const categoryModle = require("../models/category"); // ייבוא המודל של הקטגוריות

module.exports = {
  // פונקציה לקבלת כל הקטגוריות
  GetAll: (req, res) => {
    try {
      // חיפוש כל הקטגוריות במסד הנתונים
      categoryModle.find().then((categories) => {
        // שולחים את המידע לתבנית בשם 'categories' כדי להציג את הקטגוריות בדף HTML
        res.render("categories", { categories: categories });
      });
    } catch (err) {
      // במקרה של שגיאה בשרת, מחזירים קוד שגיאה 500 עם הודעה
      return res.status(500).json({ Msg: "שגיאה בשרת (500)" });
    }
  },

  // פונקציה לקבלת קטגוריה לפי מזהה
  GetByID: (req, res) => {
    try {
      // חיפוש קטגוריה לפי מזהה (cid) שנמצא ב-URL
      categoryModle.find({ cid: req.params.id }).then((category) => {
        // מחזירים את המידע של הקטגוריה כ-JSON
        return res.status(200).json(category);
      });
    } catch {
      // במקרה של שגיאה, מחזירים קוד שגיאה 500 עם הודעה
      return res.status(500).json({ Msg: "500 server Eror" });
    }
  },

  // פונקציה להוספת קטגוריה חדשה
  AddNew: (req, res) => {
    try {
      // הוספת נתונים חדשים (קטגוריה) למסד הנתונים
      categoryModle.insertMany([req.body]).then((data) => {
        // מחזירים את המידע שנוסף כ-JSON
        return res.status(200).json(data);
      });
    } catch {
      // במקרה של שגיאה, מחזירים קוד שגיאה 500 עם הודעה
      return res.status(500).json({ Msg: "500 server Eror" });
    }
  },

  // פונקציה לעדכון קטגוריה לפי מזהה
  UpdateByID: (req, res) => {
    try {
      // עדכון קטגוריה לפי מזהה (cid) שנמצא ב-URL
      categoryModle.updateOne({ cid: req.params.id }, req.body).then((data) => {
        // מחזירים את המידע המעודכן כ-JSON
        return res.status(200).json(data);
      });
    } catch {
      // במקרה של שגיאה, מחזירים קוד שגיאה 500 עם הודעה
      return res.status(500).json({ Msg: "500 server Eror" });
    }
  },

  // פונקציה למחיקת קטגוריה לפי מזהה
  DeletByID: (req, res) => {
    try {
      // מחיקת קטגוריה לפי מזהה (cid) שנמצא ב-URL
      categoryModle.deleteOne({ cid: req.params.id }).then((data) => {
        // מחזירים את המידע על המחיקה כ-JSON
        return res.status(200).json(data);
      });
    } catch {
      // במקרה של שגיאה, מחזירים קוד שגיאה 500 עם הודעה
      return res.status(500).json({ Msg: "500 server Eror" });
    }
  },
};
