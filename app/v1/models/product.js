const mongoose = require('mongoose'); // ייבוא mongoose

const productSchema = new mongoose.Schema({
  pname: {
    type: String,
    required: true, // חובה שם מוצר
    trim: true,
  },
  price: {
    type: Number,
    required: true, // חובה מחיר
    min: 0,
  },
  pdesc: {
    type: String,
    trim: true, // תיאור מוצר
  },
  picname: {
    type: String, // שם קובץ תמונה (אפשר גם URL)
    trim: true,
  },
  pid: {
    type: Number,
    required: true, // מזהה פנימי שאתה משתמש בו
    unique: true,
  },
  cid: {
    type: Number, // בהמשך אולי תשקול להפוך את זה ל־ObjectId לקשר ישיר לקטגוריה
    required: true,
  },
}, {
  timestamps: true, // מוסיף createdAt ו־updatedAt
});

// יצירת המודל מהמגדיר
const Product = mongoose.model('Product', productSchema);

// ייצוא
module.exports = Product;
