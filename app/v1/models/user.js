// ✅ קובץ user.js - מודל משתמש
const mongoose = require("mongoose");

// הגדרת הסכימה של המשתמש
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // חובה להזין שם
    trim: true
  },
  email: {
    type: String,
    required: true, // חובה להזין אימייל
    unique: true, // אימייל חייב להיות ייחודי
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true // חובה להזין סיסמה
  },
  resetToken: String, // 🔐 טוקן איפוס סיסמה (אם נשלח מייל איפוס)
  resetTokenExpiration: Date // 🕒 תאריך תפוגת הטוקן
}, {
  timestamps: true // מוסיף אוטומטית createdAt ו־updatedAt
});

// יצירת המודל של המשתמש מתוך הסכימה
const User = mongoose.model("User", userSchema);

// ייצוא המודל
module.exports = User;
