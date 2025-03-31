const express = require("express"); // ייבוא ספריית express – לבניית שרת
const morgan = require("morgan"); // ייבוא morgan – לוגים של בקשות HTTP
const path = require("path"); // ייבוא path – לניהול נתיבים
const app = express(); // יצירת אפליקציית express
const bcrypt = require("bcryptjs"); // הצפנת סיסמאות
const session = require('express-session'); // ניהול session (למשתמשים, עגלה וכו')
const mongoose = require("mongoose"); // ייבוא mongoose – חיבור למסד נתונים

// 📁 ייבוא ראוטרים וקונטרולרים
const productRouter = require("./app/v1/routes/product");
const categoryRouter = require("./app/v1/routes/category");
const userRouter = require("./app/v1/routes/user");
const orderRouter = require("./app/v1/routes/order");
const cartRoutes = require('./app/v1/routes/cart');
const categoryController = require("./app/v1/controllers/category");
const orderController = require("./app/v1/controllers/order");
const userController = require("./app/v1/controllers/user");
const open = require("open"); // לפתיחת דפדפן אוטומטית (אם תרצה בהמשך)

// ✅ מאפשר קריאת בקשות בפורמט JSON
app.use(express.json());

// ✅ התחברות ל-MongoDB
const mongoConnStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@curd-demo-two-cluster.8pd7zcn.mongodb.net/'webpharm`;

mongoose
  .connect(mongoConnStr)
  .then(() => {
    console.log("connected to mongo"); // הודעה על חיבור מוצלח
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err); // טיפול בשגיאה
  });

// ✅ לוגים של בקשות
app.use(morgan("dev"));

// ✅ מאפשר שליחת טפסים בפורמט x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// ✅ הגדרת express-session (לפני שימוש ב-session)
app.use(session({
  secret: 'secret_key_for_cart', // מפתח ההצפנה של הסשן
  resave: false,
  saveUninitialized: true
}));

// ✅ הגדרת נתונים גלובליים לתבניות EJS – ניגשים אליהם ישירות ב־navbar.ejs
app.use((req, res, next) => {
  res.locals.session = req.session; // session לכל תבנית
  res.locals.user = req.session.user || null; // user מחובר אם קיים
  next();
});

// ✅ הגדרת מנוע תבניות EJS
app.set("view engine", "ejs");

// ✅ הגדרת מיקום תיקיית views
app.set("views", path.join(__dirname, "app", "v1", "views"));

// ✅ הגדרת תיקיית קבצים סטטיים (CSS, תמונות וכו')
app.use(express.static(path.join(__dirname, "public")));


// ✅ נתיב ראשי – עמוד התחברות
app.get("/", (req, res) => {
  res.render("auth/login"); // מציג את login.ejs מתיקיית views/auth
});

// ✅ חיבור כל הראוטרים לפי נתיבם
app.use("/", userRouter); // טיפולים כמו login, register (אם קיימים שם)
app.use("/product", productRouter); // מוצרי חנות
app.use("/category", categoryRouter); // קטגוריות
app.use("/order", orderRouter); // הזמנות
app.use("/cart", cartRoutes); // עגלת קניות


// ✅ במידה ואתה לא משתמש בראוטר ל-register – הגדרה ישירה
app.get("/register", userController.register);

// ✅ טיפול בנתיבים שלא קיימים (404)
app.all("*", (req, res) => {
  return res.status(404).json({ Msg: "not found 404" });
});

module.exports = app;
