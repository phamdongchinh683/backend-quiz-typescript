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
const uuid_1 = require("uuid");
const mySql = config_1.default.getInstance();
const connection = mySql.getPool();
const ExamService = {
    examQuestion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [results, fields] = yield connection.query(`select 
          q.id,
          category.id as category_id,
          q.correct_answer
      from 
        questions q 
      JOIN
          categories category on q.category_question = category.id
      WHERE 
        q.exam_id = ?`, [id]);
                return results;
            }
            catch (error) {
                return null;
            }
        });
    },
    Exams() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const statementType = "Select";
                const [results, fields] = yield connection.query(`CALL spExam(?, ?, ?,?,?,?,?);`, [null, null, null, null, null, null, statementType]);
                return results[0];
            }
            catch (error) {
                return null;
            }
        });
    },
    takeExam(testId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [results, fields] = yield connection.query(`
    SELECT 
        qst.id, 
        qst.question_content,
        qst.answer_list
    FROM 
        questions qst 
    JOIN 
        categories ctgr on qst.category_question = ctgr.id
    JOIN 
        exams exam on qst.exam_id = exam.id
    WHERE 
        exam.id = ?
    ORDER BY 
        CASE 
            WHEN ctgr.name = 'Listening' THEN 1
            WHEN ctgr.name = 'Speaking' THEN 2
            ELSE 3
        END, 
        ctgr.name`, [testId]);
                return results;
            }
            catch (error) {
                return null;
            }
        });
    },
    saveResult(param) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [results, fields] = yield connection.query(`INSERT INTO scores
        (id, exam_id, user_id, score, time, exam_date)
        VALUES (?, ?, ?, ?,?, ?)`, [(0, uuid_1.v4)(), param.exam_id, param.user_id, param.score, param.time, param.exam_date]);
                return results;
            }
            catch (error) {
                return null;
            }
        });
    }
};
exports.default = ExamService;
