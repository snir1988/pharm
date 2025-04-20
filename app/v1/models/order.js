const mongoose = require('mongoose'); // ייבוא mongoose לצורך עבודה עם MongoDB

// יצירת סכמת הזמנות
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // הפניה למודל של משתמש
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // הפניה למודל של מוצר
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },

  // ✅ שדה חדש: סטטוס ההזמנה
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'], // ערכים מותרים
    default: 'pending', // כברירת מחדל - ממתין לתשלום
  },

  orderDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // מוסיף שדות createdAt ו־updatedAt אוטומטית
});

// יצירת מודל של הזמנה לפי הסכמה
const Order = mongoose.model('Order', orderSchema);

// ייצוא המודל לשימוש בקבצים אחרים
module.exports = Order;
