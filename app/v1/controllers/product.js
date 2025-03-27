const productModle = require("../models/product");


module.exports = {
  // פונקציה לקבלת כל המוצרים
  GetAll: (req, res) => {
    console.log("לא כאן", req.body);
    try {
      // חיפוש כל המוצרים במסד הנתונים
      productModel.find().then((products) => {
        // אם אתה רוצה להציג את המוצרים בדף HTML, אתה משתמש ב-res.render
        res.render('products', { products: products });
      });
    } catch (err) {
      // במקרה של שגיאה בשרת, מחזירים קוד שגיאה 500 עם הודעה
      return res.status(500).json({ Msg: "שגיאה בשרת (500)" });
    }
  },

  // פונקציה לקבלת מוצר לפי מזהה
  GetByID: (req, res) => {
    try {
      // חיפוש מוצר לפי מזהה (pid) שנמצא ב-URL
      productModle.find({ pid: req.params.id }).then((product) => {
        // מחזירים את המידע של המוצר כ-JSON
        return res.status(200).json(product);
      });
    } catch {
      // במקרה של שגיאה, מחזירים קוד שגיאה 500 עם הודעה
      return res.status(500).json({ Msg: "500 server Eror" });
    }
  },

  // פונקציה להוספת מוצר חדש
  AddNew: (req, res) => {
    try {
      // הוספת נתונים חדשים (מוצר) למסד הנתונים
      productModle.insertMany([req.body]).then((data) => {
        // כאן אין צורך ב-res.render כי זה פעולה של הוספה ולא הצגת מידע למשתמש
        return res.status(200).json(data);
      });
    } catch {
      // במקרה של שגיאה, מחזירים קוד שגיאה 500 עם הודעה
      return res.status(500).json({ Msg: "500 server Eror" });
    }
  },

  // פונקציה לעדכון מוצר לפי מזהה
  UpdateByID: (req, res) => {
    try {
      // עדכון מוצר לפי מזהה (pid) שנמצא ב-URL
      productModle.updateOne({ pid: req.params.id }, req.body).then((data) => {
        // גם כאן אין צורך ב-res.render כי אנחנו מעדכנים ולא מציגים מידע בדף
        return res.status(200).json(data);
      });
    } catch {
      // במקרה של שגיאה, מחזירים קוד שגיאה 500 עם הודעה
      return res.status(500).json({ Msg: "500 server Eror" });
    }
  },

  // פונקציה למחיקת מוצר לפי מזהה
  DeletByID: (req, res) => {
    try {
      // מחיקת מוצר לפי מזהה (pid) שנמצא ב-URL
      productModle.deleteOne({ pid: req.params.id }).then((data) => {
        // גם כאן אין צורך ב-res.render כי מדובר במחיקה ולא בהצגת מידע
        return res.status(200).json(data);
      });
    } catch {
      // במקרה של שגיאה, מחזירים קוד שגיאה 500 עם הודעה
      return res.status(500).json({ Msg: "500 server Eror" });
    }
  },
};

