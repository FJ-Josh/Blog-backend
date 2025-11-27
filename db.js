const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "bnpurkro2n86avb9woau-mysql.services.clever-cloud.com",
    user: "u1bxctqneeqfbnfq",
    password: "tx2zvKVHyRwqw5tgAvvg",
    database: "bnpurkro2n86avb9woau",
    port: 3306
});

db.connect((err) => {
    if (err) throw err;
    console.log("MySQL Connected!");
});

module.exports = db;
