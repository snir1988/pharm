module.exports = {
  login: (req, res) => {
    // כאן אנחנו יכולים לשלוח את הטופס של התחברות
    res.render('auth/login'); // ✅ מציג את דף login מתוך views/auth/
  },

  register: (req, res) => {
    // גם כאן אנחנו שולחים את הטופס של רישום
    res.render('auth/register'); // ✅ מציג את דף register מתוך views/auth/
  },
};

