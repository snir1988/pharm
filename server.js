require ('dotenv').config();
const http = require('http');
const app = require('./app');
const open = require('open'); // ייבוא מודול 'open'


const Server=http.createServer(app);
const PORT = process.env.PORT || 3030;

Server.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
    // פותח את דף ההתחברות בדפדפן באופן אוטומטי
    open(`http://localhost:${PORT}/login`);
});
