const express = require('express');
const router = express.Router();

// 🟦 ייבוא הפונקציות מתוך ה־controller
const { ShowVIPForm, AddVIP } = require('../controllers/vip');

// ✅ הצגת טופס ההצטרפות (GET)
router.get('/', ShowVIPForm);

// ✅ שליחת טופס הרשמה ושמירה (POST)
router.post('/', AddVIP);

module.exports = router; // ⬅️ ייצוא הנתיבים לשימוש בקובץ app.js
