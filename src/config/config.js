const mysql = require("mysql2/promise");
require("dotenv").config();
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

const checkConnect = async () => {
  try {
    await connection.getConnection();
    console.log("Connected to MySQL database!");
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("Type Error occurred:", error);
    } else if (error instanceof ReferenceError) {
      console.error("Reference error occurred:", error.message);
    } else {
      console.error("Error connecting to MySQL database:", error.message);
    }
  }
};

checkConnect();

module.exports = connection;
