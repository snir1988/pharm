const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart'); // ייבוא הקונטרולר




// ✅ נתיב POST להוספה לעגלה
router.post('/add', cartController.addToCart);
// ✅ נתיב POST לעדכון כמות בעגלה
router.post('/update', cartController.updateCartQuantity);


router.get('/', cartController.getCart); // תצוגת העגלה
// ✅ מחיקת מוצר מהעגלה
router.post('/remove', cartController.removeFromCart);


module.exports = router;
