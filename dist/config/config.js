"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise"));
dotenv_1.default.config();
class Database {
    constructor() {
        const access = {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 20,
            queueLimit: 0
        };
        this.connection = promise_1.default.createPool(access);
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    checkConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield this.connection.getConnection();
                conn.release();
                console.log("Connected to MySQL");
            }
            catch (error) {
                if (error instanceof TypeError) {
                    console.log("Type Error occurred:", error.message);
                }
                else if (error instanceof ReferenceError) {
                    console.log("Reference error occurred:", error.message);
                }
                else {
                    console.log("Error connecting to MySQL database:", error);
                }
            }
        });
    }
    getPool() {
        return this.connection;
    }
}
const hh = Database.getInstance();
exports.default = Database;
