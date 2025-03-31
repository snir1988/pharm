const express = require("express"); // ייבוא express
const mongoose = require("mongoose"); // ✅ הוספה: נדרש בשביל יצירת ObjectId
const authMiddleware = require("../middelewares/auth"); // ייבוא המידלוור לאימות משתמשים
const Order = require("../models/order"); // ייבוא מודל ההזמנה

const router = express.Router(); // יצירת router חדש

// ✅ POST /order → יצירת הזמנה חדשה (דורש התחברות)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { products, totalPrice } = req.body; // נתוני ההזמנה מהבקשה

    // יצירת מסמך הזמנה חדש
    const order = new Order({
      _id: new mongoose.Types.ObjectId(), // מזהה ייחודי להזמנה
      userId: req.user._id, // מזהה המשתמש מתוך ה-token
      products, // רשימת מוצרים
      totalPrice, // סה"כ מחיר
    });

    await order.save(); // שמירה למסד הנתונים

    res.status(201).json({ message: "Order placed successfully", order }); // תשובת הצלחה
  } catch (err) {
    res.status(500).json({ message: "Error placing order", error: err });
  }
});

// ✅ GET /orders → קבלת ההזמנות של המשתמש המחובר
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    // שליפת הזמנות לפי מזהה המשתמש
    const orders = await Order.find({ userId: req.user._id }).populate(
      "products.productId" // אם productId הוא ref למוצר
    );

    res.json(orders); // החזרת ההזמנות כ-JSON
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err });
  }
});

module.exports = router; // ייצוא ה-router ל-app.js
