// ✅ קובץ controller: order.js - מעודכן עם פתרון לשגיאת ObjectId ומעקב
const orderModel = require('../models/order'); // ייבוא מודל ההזמנות
const Product = require('../models/product'); // ייבוא מודל המוצרים
const mongoose = require("mongoose"); // נדרש ליצירת ObjectId

module.exports = {
  // ✅ הצגת כל ההזמנות (עבור מנהל/דשבורד)
  GetAll: (req, res) => {
    try {
      orderModel.find().then((orders) => {
        res.render('orders/order', { orders }); // הצגת רשימת כל ההזמנות
      });
    } catch (err) {
      return res.status(500).json({ Msg: "שגיאה בשרת (500)" });
    }
  },

  // ✅ יצירת הזמנה חדשה מתוך עגלת הקניות
  createOrder: async (req, res) => {
    try {
      console.log("📦 קיבלנו את body:", req.body); // הדפסת הנתונים שהתקבלו מהטופס

      // שליפת עגלה מהטופס או מה-session
      let cartRaw = req.body.cart;
      let cart = cartRaw ? JSON.parse(decodeURIComponent(cartRaw)) : req.session.cart;
      let totalPrice = req.body.totalPrice ? parseFloat(req.body.totalPrice) : 0;

      console.log("📦 עגלה (cart):", cart);
      console.log("💰 סה\"כ לתשלום:", totalPrice);

      if (!cart || cart.length === 0) {
        return res.redirect("/cart"); // אם אין עגלה - נחזור לעגלה
      }

      // ✅ שליפה ממסד הנתונים של כל מוצר לפי pid, והמרה ל־ObjectId אמיתי
      const products = await Promise.all(cart.map(async (item) => {
        const product = await Product.findOne({ pid: item.pid }); // חיפוש לפי pid (ולא _id)
        if (!product) {
          console.log("🚫 מוצר לא נמצא במסד:", item.pid);
          return null; // דילוג על מוצרים שלא קיימים
        }
        return {
          productId: product._id, // שימוש ב־ObjectId אמיתי
          quantity: item.qty // כמות מהמוצר
        };
      }));

      // סינון מוצרים לא תקינים (null)
      const validProducts = products.filter(p => p !== null);

      if (validProducts.length === 0) {
        return res.redirect("/cart"); // אם לא נותרו מוצרים חוקיים
      }

      // חישוב סכום כולל אם לא נשלח מהלקוח
      if (!totalPrice || totalPrice === 0) {
        const productDocs = await Promise.all(cart.map(item =>
          Product.findOne({ pid: item.pid })
        ));

        totalPrice = productDocs.reduce((sum, p, i) =>
          sum + (p?.price || 0) * cart[i].qty, 0
        );
      }

      // יצירת ההזמנה בפועל
      const order = new orderModel({
        _id: new mongoose.Types.ObjectId(), // מזהה ייחודי
        userId: req.user._id, // מזהה המשתמש המחובר
        products: validProducts, // רשימת מוצרים עם ObjectId
        totalPrice, // סכום כולל
        status: "pending" // סטטוס ממתין
      });

      await order.save(); // שמירה למסד הנתונים
      req.session.cart = []; // ניקוי עגלה

      res.redirect(`/order/payment/${order._id}`);
 // מעבר לתשלום

    } catch (err) {
      console.error("שגיאה ביצירת ההזמנה:", err); // הדפסת שגיאה
      res.status(500).send("שגיאה ביצירת ההזמנה");
    }
  },

  // ✅ הצגת ההזמנות של המשתמש המחובר
  getUserOrders: async (req, res) => {
    try {
      const orders = await orderModel.find({ userId: req.user._id }).populate("products.productId");
      res.render("orders/my-orders", { orders }); // תצוגת כל ההזמנות של המשתמש
    } catch (err) {
      res.status(500).send("שגיאה בשליפת ההזמנות");
    }
  },

  // ✅ הצגת עמוד תשלום להזמנה ספציפית
  showPaymentPage: (req, res) => {
    const orderId = req.params.orderId || null; // קבלת מזהה ההזמנה מה-URL
    res.render("orders/payment", { orderId }); // טעינת עמוד תשלום
  },

  // ✅ אישור תשלום ושינוי סטטוס ההזמנה ל-paid
  confirmPayment: async (req, res) => {
    const { cardName, cardNumber, expiry, cvv, orderId } = req.body; // קבלת נתוני טופס התשלום

    try {
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { status: "paid" },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).send("ההזמנה לא נמצאה"); // לא נמצאה הזמנה עם מזהה זה
      }

      res.render("orders/confirmation", { cardName }); // טעינת עמוד תודה
    } catch (err) {
      console.error("שגיאה בעדכון סטטוס ההזמנה:", err); // הדפסת שגיאה
      res.status(500).send("שגיאה בעת עיבוד התשלום");
    }
  }
};
