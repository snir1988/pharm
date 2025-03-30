const userModle = require("../models/user");
// const User = require("../models/user"); // ייבוא המודל של המשתמשים
const bcrypt = require("bcryptjs"); // ייבוא bcryptjs להצפנת סיסמאות
const jwt = require("jsonwebtoken"); // ייבוא jsonwebtoken ליצירת טוקן
const mongoose = require("mongoose");


// פונקציה להציג את עמוד ההתחברות
exports.loginPage = (req, res) => {
  res.render("login"); // רנדר את דף ה-login מתוך תיקיית auth
};

// פונקציה להתחברות משתמש
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.render('auth/loginSuccess', { token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// פונקציה לרישום משתמש חדש
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // בדיקה אם המשתמש כבר קיים במערכת לפי האימייל
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { msg: "User already exists", error: true }); // הצגת הודעה על כך שהמשתמש כבר קיים
    }

    // הצפנת הסיסמה
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // יצירת משתמש חדש
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // אחרי רישום מוצלח, נשלח הודעה על הצלחה
    res.render('register', { msg: "User registered successfully", error: false }); // הצגת הודעה על הצלחה
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).render('register', { msg: "Server error", error: true }); // במקרה של שגיאה, מציגים הודעה בעמוד
  }
};



