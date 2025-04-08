// ייבוא המודל של המשתמשים
const User = require("../models/user");

const bcrypt = require("bcryptjs"); // להצפנת סיסמאות
const jwt = require("jsonwebtoken"); // ליצירת טוקנים
const mongoose = require("mongoose");

// ✅ הצגת עמוד ההתחברות
exports.loginPage = (req, res) => {
  res.render("auth/login"); // הצגת דף login.ejs
};

// ✅ התחברות משתמש
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // קבלת אימייל וסיסמה מהטופס

    const user = await User.findOne({ email }); // חיפוש משתמש במסד לפי אימייל
    if (!user) {
      return res.status(400).render('auth/login', {
        msg: "אימייל או סיסמה שגויים.",
        error: true
      });
    }

    // השוואת סיסמה
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render('auth/login', {
        msg: "אימייל או סיסמה שגויים.",
        error: true
      });
    }

    // ✅ יצירת טוקן JWT
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ שמירת הטוקן בתוך cookie
    res.cookie("token", token, {
      httpOnly: true, // מונע גישה מ-JavaScript
      secure: process.env.NODE_ENV === "production", // רק ב-HTTPS בפרודקשן
      maxAge: 60 * 60 * 1000 // שעה
    });

    // ✅ שמירת פרטי המשתמש ב-session (לשימוש פנימי אם אתה מציג מידע בדפים)
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // ✅ הפניה לעמוד המוצרים
    res.redirect('/product');

  } catch (err) {
    console.error("שגיאה בהתחברות:", err);
    res.status(500).render('auth/login', {
      msg: "שגיאת שרת, נסה שוב מאוחר יותר.",
      error: true
    });
  }
};

// ✅ רישום משתמש חדש
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render('auth/register', {
        msg: "הסיסמאות אינן תואמות.",
        error: true
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', {
        msg: "משתמש עם כתובת מייל זו כבר קיים.",
        error: true
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.render('auth/register-success', {
      msg: "נרשמת בהצלחה! תועבר לעמוד המוצרים בעוד רגע..."
    });

  } catch (err) {
    console.error("שגיאה ברישום:", err);
    res.status(500).render('auth/register', {
      msg: "אירעה שגיאה בשרת. נסה שוב מאוחר יותר.",
      error: true
    });
  }
};

// ✅ יציאת משתמש (התנתקות)
exports.logout = (req, res) => {
  const goodbyeMsg = "התנתקת בהצלחה.";

  // ניקוי טוקן מה-cookie
  res.clearCookie("token");
  res.clearCookie("connect.sid"); // גם הסשן נמחק

  req.session.destroy((err) => {
    if (err) {
      console.error("שגיאה בניתוק:", err);
      return res.status(500).send("שגיאה בניתוק");
    }

    res.redirect(`/login?msg=${encodeURIComponent(goodbyeMsg)}`);
  });
};
