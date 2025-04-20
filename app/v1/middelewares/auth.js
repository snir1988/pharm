const jwt = require("jsonwebtoken"); // ייבוא JWT

// ✅ מידלוור לאימות גישה – בודק גם בכותרת (Header) וגם ב-Cookie
const authMiddleware = (req, res, next) => {
  // נסה לשלוף טוקן מה-cookie
  const cookieToken = req.cookies?.token;

  // נסה לשלוף טוקן מה-header בצורה תקינה: "Authorization: Bearer <token>"
  const authHeader = req.header("Authorization");
  let headerToken = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    headerToken = authHeader.split(" ")[1];
  }

  // קביעת הטוקן לשימוש: נעדיף את זה מה-header אם קיים ותקין, אחרת ניקח מה-cookie
  const token = headerToken || cookieToken;

  // אם לא נמצא טוקן – גישה אסורה
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    // ✅ אימות הטוקן לפי המפתח הסודי (JWT_SECRET)
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ שמירת פרטי המשתמש (שנמצאים בטוקן) בתוך הבקשה – לשימוש בהמשך
    req.user = verified;

    next(); // ממשיכים לנתיב הבא
  } catch (err) {
    // אם הטוקן לא תקין או פג תוקף
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware; // ייצוא המידלוור לשימוש בקבצי נתיבים
