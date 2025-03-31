const Product = require('../models/product');


// ✅ פונקציה להוספת מוצר לעגלה
exports.addToCart = (req, res) => {
    const { pid } = req.body; // מזהה מוצר מהטופס
  
    if (!req.session.cart) {
      req.session.cart = []; // יצירת עגלה אם לא קיימת
    }
  
    const existingItem = req.session.cart.find(item => item.pid === pid);
  
    if (existingItem) {
      existingItem.qty += 1; // הגדלת כמות
    } else {
      req.session.cart.push({ pid, qty: 1 }); // הוספה ראשונית
    }
  
    res.redirect('/product'); // חזרה לעמוד המוצרים
  };
 // ✅ פונקציה להצגת העגלה
 exports.getCart = async (req, res) => {
  const cart = req.session.cart || []; // אם אין עגלה, ניצור ריקה

  // בניית עגלה עם פרטי מוצרים מלאים מהמסד
  const detailedCart = await Promise.all(cart.map(async item => {
      // שליפת המוצר לפי pid
      const product = await Product.findOne({ pid: item.pid });

      if (!product) {
          console.log("🚨 לא נמצא מוצר עם pid:", item.pid);
      }

      // החזרת פרטי המוצר, כולל picname מתוך המוצר עצמו
      return {
          pid: item.pid,                // מזהה מוצר
          pname: product.pname,         // שם המוצר
          price: product.price,         // מחיר ליחידה
          qty: item.qty,                // כמות בעגלה
          picname: product.picname,     // שולפים את שם התמונה מתוך המוצר
          total: product.price * item.qty // סכום כולל לשורה בעגלה
      };
  }));

  // חישוב הסכום הכולל
  const totalAmount = detailedCart.reduce((sum, item) => sum + item.total, 0);

  // שליחת העגלה לתבנית cart.ejs
  res.render('cart/cart', {
      cart: detailedCart,       // פרטי המוצרים בעגלה
      totalAmount               // סכום כולל לתשלום
  });
};
// ✅ פונקציה לעדכון כמות של מוצר בעגלה
exports.updateCartQuantity = (req, res) => {
  const { productId, newQuantity } = req.body;

  console.log("🚀 עדכון כמות:", { productId, newQuantity }); // ← בדיקה מה מתקבל

  if (!req.session.cart) {
    return res.json({ success: false, message: "אין עגלה פעילה" });
  }

  const item = req.session.cart.find(i => i.pid === productId);

  if (item) {
    item.qty = parseInt(newQuantity);
    return res.json({ success: true });
  } else {
    return res.json({ success: false, message: "מוצר לא נמצא בעגלה" });
  }
};
// ✅ פונקציה להסרת מוצר מהעגלה
exports.removeFromCart = (req, res) => {
  const { pid } = req.body;

  if (!req.session.cart) {
    return res.redirect('/cart');
  }

  // סינון העגלה כדי להשאיר רק פריטים שאינם המוצר הנבחר
  req.session.cart = req.session.cart.filter(item => item.pid !== pid);

  res.redirect('/cart');
};





  