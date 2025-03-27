module.exports = {
    login: (req, res) => {
      // כאן אנחנו יכולים לשלוח את הטופס של התחברות
      res.render('login'); // מציג את דף התחברות
    },
    
    register: (req, res) => {
      // גם כאן אנחנו שולחים את הטופס של רישום
      res.render('register'); // מציג את דף הרישום
    },
};
