// ✅ ייבוא המודלים של מוצרים וקטגוריות
const productModel = require("../models/product");
const categoryModel = require("../models/category");

// ✅ ייצוא כל הפונקציות
module.exports = {
  // ✅ קבלת כל המוצרים עם סינון לפי קטגוריה ומיון לפי מחיר
  GetAll: async (req, res) => {
    try {
      const { category, sort } = req.query; // קבלת פרמטרים מה-URL

      const filter = {};
      if (category) {
        filter.cid = category; // סינון לפי קטגוריה
      }

      let sortOption = {};
      if (sort === "price_asc") {
        sortOption.price = 1; // מיון לפי מחיר עולה
      } else if (sort === "price_desc") {
        sortOption.price = -1; // מיון לפי מחיר יורד
      }

      const products = await productModel.find(filter).sort(sortOption); // שליפת מוצרים עם סינון ומיון
      const categories = await categoryModel.find(); // שליפת כל הקטגוריות

      // שליחת הנתונים לתבנית EJS
      res.render("products/products", {
        products,               // רשימת מוצרים
        categories,             // רשימת קטגוריות
        selectedCategory: category || "", // לשמירה על בחירה נוכחית בטופס
        sort: sort || ""        // לשמירה על מיון נוכחי בטופס
      });
    } catch (err) {
      console.error("שגיאה בשליפת מוצרים:", err);
      return res.status(500).json({ Msg: "שגיאה בשרת (500)" });
    }
  },

  // ✅ קבלת מוצר לפי מזהה (pid)
  GetByID: (req, res) => {
    try {
      productModel.find({ pid: req.params.id }).then((product) => {
        return res.status(200).json(product);
      });
    } catch (err) {
      console.error("שגיאה בשליפת מוצר לפי מזהה:", err);
      return res.status(500).json({ Msg: "500 server Error" });
    }
  },

  // ✅ הוספת מוצר חדש למסד הנתונים
  AddNew: (req, res) => {
    try {
      productModel.insertMany([req.body]).then((data) => {
        return res.status(200).json(data);
      });
    } catch (err) {
      console.error("שגיאה בהוספת מוצר:", err);
      return res.status(500).json({ Msg: "500 server Error" });
    }
  },

  // ✅ עדכון מוצר קיים לפי מזהה (pid)
  UpdateByID: (req, res) => {
    try {
      productModel.updateOne({ pid: req.params.id }, req.body).then((data) => {
        return res.status(200).json(data);
      });
    } catch (err) {
      console.error("שגיאה בעדכון מוצר:", err);
      return res.status(500).json({ Msg: "500 server Error" });
    }
  },

  // ✅ מחיקת מוצר לפי מזהה (pid)
  DeletByID: (req, res) => {
    try {
      productModel.deleteOne({ pid: req.params.id }).then((data) => {
        return res.status(200).json(data);
      });
    } catch (err) {
      console.error("שגיאה במחיקת מוצר:", err);
      return res.status(500).json({ Msg: "500 server Error" });
    }
  }
};
