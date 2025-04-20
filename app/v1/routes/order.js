const express = require("express");
const router = express.Router();

const authMiddleware = require("../middelewares/auth");
const orderController = require("../controllers/order");
const cartController = require("../controllers/cart");

// ✅ יצירת הזמנה
router.post("/create", authMiddleware, orderController.createOrder);

// ✅ הזמנות שלי
router.get("/my-orders", authMiddleware, orderController.getUserOrders);

// ✅ עמוד תשלום
router.get("/payment/:orderId", authMiddleware, orderController.showPaymentPage);

// ✅ אישור תשלום
router.post("/confirm", authMiddleware, orderController.confirmPayment);

// ✅ הצגת עמוד checkout (אופציונלי, רק תצוגה)
router.get("/checkout", authMiddleware, cartController.checkoutPage);

module.exports = router;
