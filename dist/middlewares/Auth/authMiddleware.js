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
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_methods_1 = __importDefault(require("../../controllers/Auth/auth.methods"));
const index_1 = __importDefault(require("../../controllers/handler/index"));
const student_service_1 = __importDefault(require("../../services/student/student.service"));
const exam_service_1 = __importDefault(require("../../services/student/exam.service"));
const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
const authMiddleware = {
    authorization: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authorizationToken = req.headers["token"];
        if (!authorizationToken) {
            (0, index_1.default)({ res, status: "failed", statusCode: 401, data: "Unauthorized!" });
        }
        try {
            const verified = yield auth_methods_1.default.verifyToken(authorizationToken, tokenSecret);
            if (!verified) {
                (0, index_1.default)({ res, status: "failed", statusCode: 403, data: "You do not have access!" });
            }
            const payload = {
                username: verified.payload,
                phoneNumber: verified.payload
            };
            req.user = payload;
            next();
        }
        catch (error) {
            return (0, index_1.default)({ res, status: "failed", statusCode: 403, data: "Failed to authenticate token." });
        }
    }),
    signUpData: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstName, lastName, age, address, username, password, email, city, phoneNumber, role, } = req.body;
        function checkPasswordStrength(password) {
            let strength = 0;
            let tips = "";
            if (password.length < 8) {
                tips += "Make the password longer. ";
            }
            else {
                strength += 1;
            }
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
                strength += 1;
            }
            else {
                tips += "Use both lowercase and uppercase letters. ";
            }
            if (password.match(/\d/)) {
                strength += 1;
            }
            else {
                tips += "Include at least one number. ";
            }
            if (password.match(/[^a-zA-Z\d]/)) {
                strength += 1;
            }
            else {
                tips += "Include at least one special character. ";
            }
            if (strength < 2) {
                return { strength: "Easy to guess", tips };
            }
            else if (strength === 2) {
                return { strength: "Medium difficulty", tips };
            }
            else if (strength === 3) {
                return { strength: "Difficult", tips };
            }
            else {
                return { strength: "Extremely difficult", tips };
            }
        }
        function checkUsername(username) {
            let strength = 0;
            let tips = "";
            if (username.length < 8) {
                tips += "Make the username longer. ";
            }
            else {
                strength += 1;
            }
            if (username.match(/[a-z]/) && username.match(/[A-Z]/)) {
                strength += 1;
            }
            else {
                tips += "Use both lowercase and uppercase letters. ";
            }
            if (username.match(/\d/)) {
                strength += 1;
            }
            else {
                tips += "Include at least one number. ";
            }
            if (username.match(/[^a-zA-Z\d]/)) {
                strength += 1;
            }
            else {
                tips += "Include at least one special character. ";
            }
            if (strength < 2) {
                return { strength: "Easy to guess", tips };
            }
            else if (strength === 2) {
                return { strength: "Medium difficulty", tips };
            }
            else if (strength === 3) {
                return { strength: "Difficult", tips };
            }
            else {
                return { strength: "Extremely difficult", tips };
            }
        }
        if (!["Medium difficulty", "Difficult", "Extremely difficult"].includes(checkUsername(username).strength)) {
            return res.json({
                error: "Username: " + checkUsername(username).strength + ". " + checkUsername(username).tips,
            });
        }
        if (!["Medium difficulty", "Difficult", "Extremely difficult"].includes(checkPasswordStrength(password).strength)) {
            return res.json({
                error: "Password: " + checkPasswordStrength(password).strength + ". " + checkPasswordStrength(password).tips,
            });
        }
        if (typeof firstName !== "string" || typeof lastName !== "string") {
            return res.json("firstName or lastName is not valid");
        }
        if (typeof phoneNumber !== "string") {
            return res.json({ Error: "type of phoneNumber must be string" });
        }
        const numericAge = Number(age);
        if (isNaN(numericAge)) {
            return res.json({ Error: "type of age must be number" });
        }
        if (typeof address !== "string") {
            return res.json({ Error: "type of address must be string" });
        }
        if (typeof email !== "string" || !email.includes("@")) {
            return res.json("Error: type of email must be string and include '@'");
        }
        req.signup = req.body;
        next();
    }),
    isStudent: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const role = yield student_service_1.default.isStudent(req.body);
        if (role === "student") {
            next();
        }
        else {
            (0, index_1.default)({ res, status: "failed", statusCode: 401, data: "just only student can login!" });
        }
    }),
    roleStudent: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.user;
        if (!payload) {
            return (0, index_1.default)({ res, status: "failed", statusCode: 401, data: "Unauthorized" });
        }
        const student = yield student_service_1.default.roleStudent(payload);
        if ((student === null || student === void 0 ? void 0 : student.role) === "student") {
            req.info = student;
            next();
        }
        else {
            return (0, index_1.default)({ res, status: "failed", statusCode: 401, data: "Only students can access" });
        }
    }),
    examResult: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const examId = req.params.id;
        const payload = req.info;
        if (!payload) {
            (0, index_1.default)({ res, status: "failed", statusCode: 401, data: "Unauthorized" });
            return;
        }
        const { results, examTime, examDate } = req.body;
        const questions = yield exam_service_1.default.examQuestion(examId);
        let totalPoints = 0;
        if (results.length === 0) {
            totalPoints = 0;
        }
        else {
            for (let answer of results) {
                let question = questions === null || questions === void 0 ? void 0 : questions.find((q) => (q.id === answer.questionId));
                if (question) {
                    const isCorrect = yield bcrypt_1.default.compare(answer === null || answer === void 0 ? void 0 : answer.result, question === null || question === void 0 ? void 0 : question.correct_answer);
                    if (isCorrect === true) {
                        totalPoints += 0.25;
                    }
                }
            }
        }
        try {
            if (results) {
                req.results = {
                    exam_id: examId,
                    user_id: payload.id,
                    score: totalPoints,
                    time: examTime,
                    exam_date: examDate
                };
                next();
            }
        }
        catch (error) {
            (0, index_1.default)({ res, status: "failed", statusCode: 500, data: "Internal server error" });
        }
    }),
};
exports.default = authMiddleware;
