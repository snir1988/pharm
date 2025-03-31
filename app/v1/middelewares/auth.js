const jwt = require("jsonwebtoken"); // ייבוא ספריית JWT

// מידלוור לאימות משתמשים בעזרת JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization"); // נשלף את ההדר מהבקשה

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." }); // ללא טוקן
  }

  // לפעמים הטוקן מגיע עם Bearer: "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    // אימות הטוקן מול המפתח הסודי
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // שמירת פרטי המשתמש ב-request להמשך הבקשה
    next(); // ממשיכים למידלוור/ראוטר הבא
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" }); // טוקן לא תקין
  }
};

module.exports = authMiddleware; // ייצוא לשימוש בקובצי ראוטים
