const express = require("express");
const router = express.Router();

const authMiddleware = require("../middelewares/auth"); // ✔ תיקון שם התיקייה
const orderController = require("../controllers/order");
const cartController = require("../controllers/cart");

// יצירת הזמנה חדשה
router.post("/", authMiddleware, orderController.createOrder);

// קבלת ההזמנות של המשתמש
router.get("/my-orders", authMiddleware, orderController.getUserOrders);

// עמוד תשלום להזמנה
router.get("/payment/:orderId", authMiddleware, orderController.showPaymentPage); // ← תוקן כאן

// אישור תשלום
router.post("/confirm", authMiddleware, orderController.confirmPayment);

// עמוד checkout (לפי הסשן)
router.get("/checkout", authMiddleware, cartController.checkoutPage);

module.exports = router;
