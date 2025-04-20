// ייבוא המודל של המשתמשים
const User = require("../models/user");

const crypto = require("crypto"); // 🔑 ליצירת טוקן אקראי
const nodemailer = require("nodemailer"); // 📧 לשליחת מיילים
const bcrypt = require("bcryptjs"); // 🔐 להצפנת סיסמאות
const jwt = require("jsonwebtoken"); // 🔓 ליצירת טוקן התחברות (JWT)
const mongoose = require("mongoose");

// ✅ הצגת עמוד ההתחברות
exports.loginPage = (req, res) => {
  res.render("auth/login"); // הצגת דף ההתחברות מהתיקייה views/auth
};

// ✅ התחברות משתמש
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // קבלת אימייל וסיסמה מהטופס

    const user = await User.findOne({ email }); // חיפוש משתמש לפי אימייל
    if (!user) {
      return res.status(400).render('auth/login', {
        msg: "אימייל או סיסמה שגויים.",
        error: true
      });
    }

    const isMatch = await bcrypt.compare(password, user.password); // השוואת סיסמה מול ההאש במסד
    if (!isMatch) {
      return res.status(400).render('auth/login', {
        msg: "אימייל או סיסמה שגויים.",
        error: true
      });
    }

    // יצירת טוקן JWT עם מזהה ואימייל של המשתמש
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // שמירת הטוקן ב־cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000 // תוקף של שעה
    });

    // שמירת פרטי המשתמש ב־session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.redirect('/product'); // לאחר התחברות – מעבר לעמוד מוצרים

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

    // ✅ יצירת JWT כמו בלוגין
    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ שמירת הטוקן ב-cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000
    });

    // ✅ שמירת המשתמש ב-session
    req.session.user = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role || "user"
    };

    // ✅ הפניה לעמוד מוצרים במקום register-success
    res.redirect('/product');

  } catch (err) {
    console.error("שגיאה ברישום:", err);
    res.status(500).render('auth/register', {
      msg: "אירעה שגיאה בשרת. נסה שוב מאוחר יותר.",
      error: true
    });
  }
};


// ✅ התנתקות משתמש
exports.logout = (req, res) => {
  const goodbyeMsg = "התנתקת בהצלחה.";

  res.clearCookie("token");        // ניקוי טוקן
  res.clearCookie("connect.sid");  // ניקוי session

  req.session.destroy((err) => {
    if (err) {
      console.error("שגיאה בניתוק:", err);
      return res.status(500).send("שגיאה בניתוק");
    }

    res.redirect(`/login?msg=${encodeURIComponent(goodbyeMsg)}`);
  });
};

// ✅ הצגת טופס שכחתי סיסמה
exports.ShowForgotPasswordPage = (req, res) => {
  res.render("auth/forgot-password"); // טופס להזנת מייל
};

// ✅ שליחת קישור לאיפוס סיסמה
exports.SendResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }); // שליפת משתמש לפי מייל
    if (!user) {
      return res.render("auth/forgot-password", {
        msg: "לא נמצא משתמש עם כתובת המייל הזו.",
        error: true
      });
    }

    const token = crypto.randomBytes(32).toString("hex"); // טוקן רנדומלי
    user.resetToken = token; // שמירה במסד
    user.resetTokenExpiration = Date.now() + 3600000; // תוקף של שעה
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const resetLink = `http://localhost:3030/reset-password/${token}`;

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "איפוס סיסמה - pharmPro",
      html: `
        <p>קיבלת בקשה לאיפוס סיסמה:</p>
        <a href="${resetLink}">לחץ כאן לאיפוס</a>
        <p>אם לא ביקשת – התעלם מההודעה.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.render("auth/forgot-password", {
      msg: "קישור לאיפוס נשלח למייל שלך.",
      error: false
    });

  } catch (err) {
    console.error("שגיאה בשליחת מייל איפוס:", err);
    res.render("auth/forgot-password", {
      msg: "אירעה שגיאה. נסה שוב מאוחר יותר.",
      error: true
    });
  }
};

// ✅ הצגת טופס איפוס סיסמה לפי טוקן
exports.ShowResetForm = async (req, res) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() } // בדיקה אם עדיין בתוקף
    });

    if (!user) {
      return res.send("הקישור לאיפוס פג תוקף או לא תקין.");
    }

    res.render("auth/reset-password", {
      userId: user._id.toString(),
      token
    });

  } catch (err) {
    console.error("שגיאה בהצגת טופס איפוס:", err);
    res.send("שגיאה זמנית.");
  }
};

// ✅ עדכון סיסמה בפועל אחרי איפוס
exports.UpdatePassword = async (req, res) => {
  const { userId, token, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send("הסיסמאות אינן תואמות.");
  }

  try {
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) {
      return res.send("טוקן לא תקין או שפג תוקפו.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.redirect("/login?msg=הסיסמה אופסה בהצלחה!");

  } catch (err) {
    console.error("שגיאה בעדכון סיסמה:", err);
    res.send("אירעה שגיאה.");
  }
};
