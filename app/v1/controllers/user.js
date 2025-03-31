// ייבוא המודל של המשתמשים
const User = require("../models/user");

const bcrypt = require("bcryptjs"); // להצפנת סיסמאות
const jwt = require("jsonwebtoken"); // ליצירת טוקנים
const mongoose = require("mongoose");

// הצגת עמוד ההתחברות
exports.loginPage = (req, res) => {
  res.render("auth/login"); // ✅ מעודכן לפי המבנה החדש
};

// התחברות משתמש
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // קבלת אימייל וסיסמה מהטופס

    const user = await User.findOne({ email }); // חיפוש משתמש לפי אימייל במסד הנתונים
    if (!user) {
      // אם לא נמצא – החזרת שגיאה עם הודעה
      return res.status(400).render('auth/login', {
        msg: "Invalid credentials",
        error: true
      });
    }

    // השוואת הסיסמה המוזנת מול הסיסמה המוצפנת במסד
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render('auth/login', {
        msg: "Invalid credentials",
        error: true
      });
    }

    // ✅ שמירת פרטי המשתמש ב-session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    // ✅ הפניה לעמוד המוצרים אחרי התחברות מוצלחת
    res.redirect('/product');

  } catch (err) {
    console.error("Error during login:", err); // הדפסת שגיאה בקונסול
    res.status(500).render('auth/login', {
      msg: "Server error",
      error: true
    });
  }
};




// רישום משתמש חדש
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // ✅ בדיקה אם הסיסמאות תואמות
    if (password !== confirmPassword) {
      return res.render('auth/register', {
        msg: "הסיסמאות אינן תואמות.",
        error: true
      });
    }

    // ✅ בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', {
        msg: "משתמש עם כתובת מייל זו כבר קיים.",
        error: true
      });
    }

    // ✅ הצפנת הסיסמה
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ יצירת משתמש חדש
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save(); // שמירה למסד הנתונים

    // ✅ הודעת הצלחה והפניה לעמוד מוצרים
    res.render('auth/register-success', {
      msg: "נרשמת בהצלחה! תועבר לעמוד המוצרים בעוד רגע..."
    });

  } catch (err) {
    console.error("Error during registration:", err);

    res.status(500).render('auth/register', {
      msg: "אירעה שגיאה בשרת. נסה שוב מאוחר יותר.",
      error: true
    });
  }
};

