const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "freddy2007",
    database: "blog_app"
});

db.connect((err) => {
    if (err) throw err;
    console.log("MySQL Connected!");
});

module.exports = db;
