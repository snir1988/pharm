const express = require("express"); // ייבוא ספריית express, משמשת לבניית אפליקציות ווב
const morgan = require("morgan"); // ייבוא ספריית morgan, לצורך לוגים של בקשות HTTP
const path = require("path"); // ייבוא ספריית path לניהול נתיבים
const app = express(); // יצירת אובייקט express עבור האפליקציה
const bcrypt = require("bcryptjs"); // במקום bcrypt, השתמש ב-bcryptjs
const mongoose = require("mongoose"); // ייבוא ספריית mongoose, לצורך חיבור למונגו דטהבייס
const productRouter = require("./app/v1/routes/product"); // ייבוא הנתיב לטיפול במוצרים
const categoryRouter = require("./app/v1/routes/category"); // ייבוא הנתיב לטיפול בקטגוריות
const userRouter = require("./app/v1/routes/user"); // ייבוא הנתיבים של האימות
const userRoutes = require("./app/v1/routes/user"); // ייבוא הנתיב של המשתמשים

const orderRouter = require("./app/v1/routes/order"); // ייבוא הנתיבים של הזמנות
const categoryController = require("./app/v1/controllers/category");
const orderController = require("./app/v1/controllers/order");
const userController = require("./app/v1/controllers/user");
const open = require("open"); // ייבוא מודול 'open' לפתיחת הדפדפן

app.use(express.json()); // מאפשר לאפליקציה לקבל בקשות מסוג JSON

// חיבור למונגו DB עם חיבור מחבר בסביבה
const mongoConnStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@curd-demo-two-cluster.8pd7zcn.mongodb.net/'webpharm`;

// חיבור למונגו באמצעות המחרוזת שמספקת את פרטי הגישה
mongoose
  .connect(mongoConnStr)
  .then(() => {
    console.log("connected to mongo"); // הצגת הודעה ב-console במקרה של חיבור מוצלח
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err); // טיפול בשגיאות אם החיבור נכשל
  });

app.use(morgan("dev")); // שימוש ב-morgan כדי לעקוב אחרי בקשות HTTP (לוגים בפורמט פיתוח)
app.use(express.urlencoded({ extended: true })); // מאפשר לאפליקציה לקבל בקשות מסוג URL-encoded (כולל נתונים בטפסים)

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app", "v1", "views")); // ✅ מתוקן: כך Express ימצא את views

// 🧹 מחקתי שורות מיותרות או כפולות של static:
app.use(express.static(path.join(__dirname, "public"))); // ✅ אחת מספיקה

// 🛠 תיקון: זו הפנייה נכונה לדף הבית (אם login.ejs נמצא ב-app/v1/views)
app.get("/", (req, res) => {
  res.render("login"); // ✅ אין צורך לציין auth אם הקובץ לא נמצא בתיקיית auth
});

// 🛠 תיקון - מחקתי כפילויות והוספתי רק router אחד ל-user
app.use("/", userRouter);

// 🧼 הסרתי app.get("/login", userRouter); → זה שגוי! אתה לא שולח router לפונקציה get
// במקום זה, אם יש צורך בנתיב /login – כבר מוגדר ב-router של user.js, והוא מחובר דרך app.use("/user")

// 🛠 שאר הנתיבים נשארים:
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/order", orderRouter);

// נתיב register דרך controller - סבבה אם אתה לא משתמש ב-router עבורו:
app.get("/register", userController.register);

// טיפול ב-404:
app.all("*", (req, res) => {
  return res.status(404).json({ Msg: "not found 404" });
});

module.exports = app;