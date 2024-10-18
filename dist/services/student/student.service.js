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
const config_1 = __importDefault(require("../../config/config"));
const mySql = config_1.default.getInstance();
const connection = mySql.getPool();
const StudentService = {
    isStudent(param) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [results] = yield connection.query(`SELECT
            r.name AS role       
        from users u
        JOIN roles r on r.id = u.role_id
      where (u.username = ? OR u.phone_number = ?);
      `, [param.username, param.phoneNumber]);
                return results.length > 0 ? results[0].role : null;
            }
            catch (error) {
                return null;
            }
        });
    },
    roleStudent(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [results, fields] = yield connection.query(`SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.age,
          u.city_name,
          u.address,
          u.username,
          u.password,
          u.email,
          u.phone_number,
          u.image,
          u.birth_day,
          u.gender,
          r.name AS role       
        from users u
        JOIN roles r on r.id = u.role_id
      where (u.username = ? OR u.phone_number = ?);
      `, [payload.username, payload.phoneNumber]);
                return results[0];
            }
            catch (error) {
                return null;
            }
        });
    },
    updatePassword(newPassword, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [results, fields] = yield connection.query(`UPDATE users
        SET password = ?
        WHERE id = ?;`, [newPassword, id]);
                return results;
            }
            catch (error) {
                return null;
            }
        });
    },
    updateProfile(newInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [results, fields] = yield connection.query(`UPDATE users
        SET first_name= ?, last_name= ?,  age= ? , city_name = ?,  address= ?,email=?, phone_number=?, image=? ,birth_day =? , gender =?
        WHERE id = ?;
      `, [
                    newInfo.firstName,
                    newInfo.lastName,
                    newInfo.age,
                    newInfo.city,
                    newInfo.address,
                    newInfo.email,
                    newInfo.phoneNumber,
                    newInfo.image,
                    newInfo.birthday,
                    newInfo.gender,
                    newInfo.id
                ]);
                return results;
            }
            catch (error) {
                return null;
            }
        });
    },
    examHistory(param) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [results, fields] = yield connection.query(`
        SELECT 
        score.id, exam.name, score.user_id, score.score, score.time, score.exam_date
        FROM scores score
        JOIN exams exam on exam.id = score.exam_id
        WHERE user_id = ?
      `, [param]);
                if (results.length === 0) {
                    return null;
                }
                return results;
            }
            catch (error) {
                return null;
            }
        });
    },
    decodeToken(username, phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [results, fields] = yield connection.query(`SELECT * FROM users s 
          WHERE s.username = ? or s.phone_number =? `, [username, phoneNumber]);
                return results[0];
            }
            catch (error) {
                return null;
            }
        });
    }
};
exports.default = StudentService;
