// 📦 מודל VIP - שמירת לקוחות VIP במסד הנתונים
const mongoose = require('mongoose');

const vipSchema = new mongoose.Schema({
  fullname: { type: String, required: true }, // שם מלא
  email: { type: String, required: true, unique: true }, // אימייל
  birthdate: { type: Date, required: true }, // תאריך לידה
  city: { type: String, required: true }, // עיר
  phone: { type: String, required: true }, // טלפון
  createdAt: { type: Date, default: Date.now } // תאריך הרשמה
});

module.exports = mongoose.model('VIP', vipSchema);
