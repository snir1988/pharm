const orderModel = require('../models/order'); // ייבוא המודל של הזמנות

module.exports = {
  GetAll: (req, res) => {
    console.log("לא כאן", req.body); // הדפסת גוף הבקשה בקונסול למטרות debugging
    try {
      orderModel.find().then((orders) => {
        // אם לא הייתה שגיאה, נרנדר את הדף של ההזמנות ומעבירים את רשימת ההזמנות
        res.render('orders', { orders: orders }); // מציג את הדף עם רשימת ההזמנות
      });
    } catch (err) {
      // אם הייתה שגיאה, מחזירים שגיאת שרת
      return res.status(500).json({ Msg: "שגיאה בשרת (500)" }); // שגיאה אם לא ניתן להביא את ההזמנות
    }
  },
};
