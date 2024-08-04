import mysql, { Pool, PoolOptions } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

class Database {
  private static instance: Database;
  private connection: Pool;

  private constructor() {
    const access: PoolOptions = {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0   
    };

    this.connection = mysql.createPool(access);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async checkConnection(): Promise<void> {
    try {
      const conn = await this.connection.getConnection();
      conn.release();
      console.log("Connected to MySQL");
    } catch (error) {
      if (error instanceof TypeError) {
        console.log("Type Error occurred:", error.message);
      } else if (error instanceof ReferenceError) {
        console.log("Reference error occurred:", error.message);
      } else {
        console.log("Error connecting to MySQL database:", error);
      }
    }
  }

  public getPool(): Pool {
    return this.connection;
  }
}

const hh = Database.getInstance()


export default Database;
