const userModle = require("../models/user");
const User = require("../models/user"); // ייבוא המודל של המשתמשים
const bcrypt = require("bcryptjs"); // ייבוא bcryptjs להצפנת סיסמאות
const jwt = require("jsonwebtoken"); // ייבוא jsonwebtoken ליצירת טוקן
const mongoose = require("mongoose");

// פונקציה לרישום משתמש חדש
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body; // שליפת הנתונים מהבקשה

    // בדיקה אם המשתמש כבר קיים במערכת לפי האימייל
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" }); // אם המשתמש קיים, מחזירים הודעה עם קוד שגיאה 400
    }

    // יצירת salt והצפנת הסיסמה
    const salt = await bcrypt.genSalt(10); // יצירת salt להצפנה
    const hashedPassword = await bcrypt.hash(password, salt); // הצפנת הסיסמה

    // יצירת משתמש חדש עם שם, אימייל וסיסמה מוצפנת
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // שמירת המשתמש במסד הנתונים
    await newUser.save();

    // שימוש ב-`res.render` במקום JSON להצגת הודעת הצלחה בעמוד רישום
    res.render('registerSuccess', { msg: "User registered successfully" }); // אם הרישום הצליח, מציגים הודעה בעמוד
  } catch (err) {
    console.error("Error during registration:", err); // הדפסת שגיאה בקונסול
    res.status(500).json({ msg: "Server error", error: err.message }); // במקרה של שגיאה, מחזירים קוד שגיאה 500 עם הודעה
  }
};

// פונקציה להתחברות משתמש
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // שליפת הנתונים מהבקשה

    // חיפוש המשתמש במסד הנתונים לפי האימייל
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" }); // אם לא נמצא משתמש, מחזירים הודעה עם קוד שגיאה 400
    }

    // בדיקת התאמת הסיסמה המוזנת לסיסמה המוצפנת במסד הנתונים
    const isMatch = await bcrypt.compare(password, user.password); // השוואת הסיסמאות
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" }); // אם הסיסמאות לא תואמות, מחזירים הודעה עם קוד שגיאה 400
    }

    // יצירת טוקן JWT עם מזהה המשתמש, בעזרת המפתח הסודי מה- .env
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // הטוקן יהיה תקף לשעה
    });

    // שליחת הטוקן בתגובה ובנוסף, אפשר לעבור לעמוד משתמש מחובר
    res.render('loginSuccess', { token }); // אם ההתחברות הצליחה, מציגים את הטוקן או ככה ניתן להוסיף כפתור
  } catch (err) {
    console.error("Error during login:", err); // הדפסת שגיאה בקונסול
    res.status(500).json({ msg: "Server error", error: err.message }); // במקרה של שגיאה, מחזירים קוד שגיאה 500 עם הודעה
  }
};