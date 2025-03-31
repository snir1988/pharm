// ייבוא המודל של ההזמנות ממסד הנתונים
const orderModel = require('../models/order');

module.exports = {
  // פונקציה לקבלת כל ההזמנות והצגתן בדף
  GetAll: (req, res) => {
    console.log("לא כאן", req.body); // 🧪 הדפסת תוכן הבקשה לצורכי בדיקה (debug)

    try {
      // חיפוש כל ההזמנות במסד הנתונים
      orderModel.find().then((orders) => {
        // רינדור של דף 'orders/order' עם רשימת ההזמנות
        res.render('orders/order', { orders: orders }); // ✅ עודכן הנתיב לפי views/orders/order.ejs
      });
    } catch (err) {
      // טיפול במקרה של שגיאת שרת
      return res.status(500).json({ Msg: "שגיאה בשרת (500)" });
    }
  },
};
