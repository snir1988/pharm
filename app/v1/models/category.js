const mongoose = require('mongoose'); // ייבוא mongoose

// הגדרת סכמת הקטגוריה
const categorySchema = new mongoose.Schema({
  pname: {
    type: String,
    required: true, // חובה להזין שם קטגוריה
    trim: true,
  },
  picname: {
    type: String, // שם קובץ של תמונה
    trim: true,
  },
  cid: {
    type: Number, // מזהה פנימי לקטגוריה (אם אתה משתמש בו)
    required: true,
    unique: true,
  },
}, {
  timestamps: true, // הוספת createdAt ו-updatedAt אוטומטית
});

// יצירת המודל מתוך הסכמה
const Category = mongoose.model('Category', categorySchema);

// ייצוא המודל
module.exports = Category;
