const Product = require('../models/product'); // ייבוא מודל המוצרים מהמסד

// ✅ פונקציה להוספת מוצר לעגלה
exports.addToCart = (req, res) => {
    const { pid } = req.body; // שליפת מזהה המוצר מהבקשה (POST)

    if (!req.session.cart) {
        req.session.cart = []; // יצירת עגלת קניות חדשה אם עדיין לא קיימת
    }

    const existingItem = req.session.cart.find(item => item.pid === pid); // חיפוש אם המוצר כבר בעגלה

    if (existingItem) {
        existingItem.qty += 1; // אם קיים – מגדילים את הכמות
    } else {
        req.session.cart.push({ pid, qty: 1 }); // אם לא – מוסיפים מוצר חדש עם כמות ראשונית 1
    }

    res.redirect('/product'); // חזרה לעמוד המוצרים לאחר הוספה
};

// ✅ פונקציה להצגת עגלת הקניות
// ✅ פונקציה להצגת עגלת הקניות
exports.getCart = async (req, res) => {
    const cart = req.session.cart || []; // שליפת עגלה קיימת או יצירת עגלה ריקה

    // ✅ שליפה מהמסד של כל המוצרים שמופיעים בעגלה לפי ה־pid
    const detailedCart = await Promise.all(cart.map(async item => {
        const product = await Product.findOne({ pid: item.pid }); // שליפת מוצר מהמסד

        if (!product) {
            console.log("🚨 לא נמצא מוצר עם pid:", item.pid); // הודעת שגיאה אם מוצר לא קיים במסד
        }

        return {
            pid: item.pid, // מזהה מוצר
            pname: product.pname, // שם המוצר
            price: product.price, // מחיר ליחידה
            qty: item.qty, // כמות בעגלה
            picname: product.picname, // שם קובץ התמונה
            total: product.price * item.qty // חישוב סכום כולל למוצר (מחיר * כמות)
        };
    }));

    const totalPrice = detailedCart.reduce((sum, item) => sum + item.total, 0); // חישוב סך הכול של כל המוצרים בעגלה

    // ✅ שליחה של העגלה והסכום לתבנית cart.ejs
    res.render('cart/cart', {
        cart: detailedCart, // עגלה עם פרטי המוצרים
        totalPrice          // סכום כולל לכל המוצרים – נשלח בשם תואם לקובץ EJS
    });
};


// ✅ פונקציה לעדכון כמות של מוצר בעגלה
exports.updateCartQuantity = (req, res) => {
    const { productId, newQuantity } = req.body; // שליפת מזהה מוצר וכמות חדשה מהבקשה

    console.log("🚀 עדכון כמות:", { productId, newQuantity }); // הדפסה לבדיקה

    if (!req.session.cart) {
        return res.json({ success: false, message: "אין עגלה פעילה" }); // אם אין עגלה – מחזירים שגיאה
    }

    const item = req.session.cart.find(i => i.pid === productId); // חיפוש מוצר בעגלה לפי pid

    if (item) {
        item.qty = parseInt(newQuantity); // עדכון כמות
        return res.json({ success: true });
    } else {
        return res.json({ success: false, message: "מוצר לא נמצא בעגלה" }); // אם לא נמצא – מחזירים שגיאה
    }
};

// ✅ פונקציה להסרת מוצר מהעגלה
exports.removeFromCart = (req, res) => {
    const { pid } = req.body; // שליפת מזהה מוצר מתוך הבקשה

    if (!req.session.cart) {
        return res.redirect('/cart'); // אם אין עגלה – חזרה מיידית
    }

    // מסננים החוצה את המוצר שצריך להסיר
    req.session.cart = req.session.cart.filter(item => item.pid !== pid);

    res.redirect('/cart'); // חזרה לעגלת הקניות
};

// ✅ פונקציה להצגת עמוד checkout (מעבר לתשלום)
exports.checkoutPage = async (req, res) => {
    const cart = req.session.cart || []; // קבלת עגלת הקניות

    if (cart.length === 0) {
        return res.redirect('/cart'); // אם העגלה ריקה – חזרה
    }

    // שליפת פרטים מהמוצרים במסד לפי pid
    const detailedCart = await Promise.all(cart.map(async item => {
        const product = await Product.findOne({ pid: item.pid });

        return {
            pid: item.pid,
            pname: product.pname,
            price: product.price,
            qty: item.qty,
            total: product.price * item.qty
        };
    }));

    const totalAmount = detailedCart.reduce((sum, item) => sum + item.total, 0); // חישוב סכום כולל

    res.render("orders/checkout", {
        cart: detailedCart,
        totalAmount,
        user: req.user // נשלף ממידלוור האימות – לטובת הצגת פרטי המשתמש
    });
};
