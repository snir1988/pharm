const userModle = require("../models/user");
const User = require("../models/user"); // ייבוא המודל של המשתמשים
const bcrypt = require("bcryptjs"); // ייבוא bcryptjs להצפנת סיסמאות
const jwt = require("jsonwebtoken"); // ייבוא jsonwebtoken ליצירת טוקן
const mongoose = require("mongoose");

// פונקציה לרישום משתמש חדש
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body; // קבלת הנתונים מהבקשה

    // בדיקה אם המשתמש כבר קיים במערכת לפי האימייל
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" }); // החזרת שגיאה אם המשתמש קיים
    }

    // יצירת salt והצפנת הסיסמה
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // יצירת משתמש חדש עם שם, אימייל וסיסמה מוצפנת
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // שמירת המשתמש במסד הנתונים
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" }); // החזרת הודעה על הצלחת הרישום
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ msg: "Server error", error: err.message }); // טיפול בשגיאות במקרה של בעיה בשמירה
  }
};

// פונקציה להתחברות משתמש
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // קבלת אימייל וסיסמה מהבקשה

    // חיפוש המשתמש במסד הנתונים לפי האימייל
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" }); // החזרת שגיאה אם המשתמש לא קיים
    }

    // בדיקת התאמת הסיסמה המוזנת לסיסמה המוצפנת במסד הנתונים
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" }); // החזרת שגיאה אם הסיסמה שגויה
    }

    // יצירת טוקן JWT עם מזהה המשתמש, בעזרת המפתח הסודי מה- .env
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // הטוקן יהיה תקף לשעה
    });

    res.status(200).json({ token }); // החזרת הטוקן כתגובה
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ msg: "Server error", error: err.message }); // טיפול בשגיאות במקרה של בעיה בהתחברות
  }
};