// ✅ ייבוא מודולים נדרשים
const VIP = require('../models/vip'); // ייבוא מודל VIP ממסד הנתונים
const nodemailer = require('nodemailer'); // מודול לשליחת מיילים

// ✅ הגדרת טרנספורטר לשליחת מיילים דרך Gmail (שימוש בפרטי ההתחברות מה-.env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // כתובת Gmail
    pass: process.env.MAIL_PASS  // סיסמת אפליקציה
  },
  tls: {
    rejectUnauthorized: false // ⛔ מאפשר שליחה גם עם תעודות לא חתומות (בסביבת פיתוח בלבד)
  }
});

// ✅ הצגת טופס VIP (GET)
exports.ShowVIPForm = (req, res) => {
  res.render('vip'); // טוען את views/vip.ejs
};

// ✅ טיפול בשליחת טופס VIP (POST) כולל שמירה במסד ושליחת מייל
exports.AddVIP = async (req, res) => {
  const { fullname, email, birthdate, city, phone } = req.body;

  try {
    // 🔍 בדיקה אם הלקוח כבר קיים לפי כתובת אימייל
    const existingVIP = await VIP.findOne({ email });
    if (existingVIP) {
        res.render('auth/vip-success', {
            fullname,
            existing: true
          });
          
      }
      

    // ✅ יצירת לקוח חדש ושמירתו במסד הנתונים
    const newVIP = new VIP({ fullname, email, birthdate, city, phone });
    await newVIP.save();

    // ✅ הגדרת תוכן המייל עם ברכה ושובר הנחה
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'ברוך הבא למועדון ה־VIP שלנו 🎉',
      html: `
        <h3>שלום ${fullname}!</h3>
        <p>שמחים שנרשמת למועדון ה־VIP שלנו 🥳</p>
        <p>בתור התחלה – קבל מאיתנו <strong>שובר של 25% הנחה</strong> לקנייה הבאה שלך!</p>
        <p>נתראה בקרוב 🎁</p>
      `
    };

    // ✅ שליחת המייל
    await transporter.sendMail(mailOptions);

    // ✅ הצגת עמוד הצלחה מותאם ל-VIP
    res.render('vip-success', { fullname });

  } catch (err) {
    console.error('שגיאה בהרשמה ל־VIP:', err);
    res.status(500).render('vip', {
      msg: "אירעה שגיאה בהרשמה למועדון VIP. נסה שוב מאוחר יותר.",
      error: true
    });
  }
};