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
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../../config/config"));
const exam_service_1 = __importDefault(require("../../services/student/exam.service"));
const student_service_1 = __importDefault(require("../../services/student/student.service"));
const handler_1 = __importDefault(require("../handler"));
const auth_methods_1 = __importDefault(require("./auth.methods"));
const saltRounds = 10;
const TokenSecret = process.env.ACCESS_TOKEN_SECRET;
const TokenLife = process.env.ACCESS_TOKEN_LIFE;
const mySql = config_1.default.getInstance();
const connection = mySql.getPool();
const authController = {
    signup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.signup) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: "Signup data is not available" });
            return;
        }
        const { firstName, lastName, age, address, username, password, email, city, phoneNumber, birthDay, gender, role, } = req.signup;
        try {
            const StatementType = "SignUp";
            const image = process.env.DEFAULT_AVATAR;
            const userID = (0, uuid_1.v4)();
            const hashPassword = yield bcrypt_1.default.hash(password, saltRounds);
            const [results] = yield connection.query(`CALL spAuth(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
                userID,
                firstName,
                lastName,
                age,
                city,
                address,
                username,
                hashPassword,
                email,
                phoneNumber,
                role,
                image,
                birthDay,
                gender,
                StatementType,
            ]);
            if (results) {
                (0, handler_1.default)({ res, status: "success", statusCode: 200, data: "Successfully created account" });
            }
        }
        catch (error) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 500, data: "This account exists" });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password, phoneNumber } = req.body;
        try {
            const StatementType = "Login";
            const [rows] = yield connection.query(`CALL spAuth(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
                null,
                null,
                null,
                null,
                null,
                null,
                username,
                password,
                null,
                phoneNumber,
                null,
                null,
                null,
                null,
                StatementType,
            ]);
            const user = rows[0][0];
            if (!user) {
                (0, handler_1.default)({ res, status: "failed", statusCode: 403, data: "Username or password is incorrect" });
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                (0, handler_1.default)({ res, status: "failed", statusCode: 404, data: "The password that you've entered is incorrect." });
            }
            else {
                const dataForAccessToken = user.username || user.phone_number;
                const accessToken = yield auth_methods_1.default.generateToken(dataForAccessToken, TokenSecret, TokenLife);
                (0, handler_1.default)({ res, status: "success", statusCode: 200, data: accessToken });
            }
        }
        catch (error) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 500, data: "hehe" });
        }
    }),
    refreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, phoneNumber } = req.body;
        try {
            const refresh = yield student_service_1.default.decodeToken(username, phoneNumber);
            if (!refresh) {
                (0, handler_1.default)({ res, status: "failed", statusCode: 403, data: "Can't decode token" });
            }
            const data = (refresh === null || refresh === void 0 ? void 0 : refresh.username) || (refresh === null || refresh === void 0 ? void 0 : refresh.phone_number);
            const accessToken = yield auth_methods_1.default.generateToken(data, TokenSecret, TokenLife);
            if (!accessToken) {
                (0, handler_1.default)({ res, status: "failed", statusCode: 403, data: "Create access token failed" });
            }
            else {
                (0, handler_1.default)({ res, status: "success", statusCode: 200, data: accessToken });
            }
        }
        catch (error) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 500, data: error });
        }
    }),
    profileView: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.info;
        try {
            if (!user) {
                (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: "Not found your information" });
            }
            (0, handler_1.default)({ res, status: "success", statusCode: 200, data: user });
        }
        catch (error) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 500, data: "Internal server error" });
        }
    }),
    examHistory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.info;
        if (!user) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 401, data: "Only students can access" });
            return;
        }
        try {
            const history = yield student_service_1.default.examHistory(user.id);
            if (history) {
                (0, handler_1.default)({ res, status: "success", statusCode: 200, data: history });
            }
            else {
                (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: "There is no exam storage data" });
            }
        }
        catch (error) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: "Server Error" });
        }
    }),
    updatePassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.info;
        const { password, newPassword } = req.body;
        if (!user) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 401, data: "Only students can access" });
            return;
        }
        const currentPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!currentPassword) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: "Current password is incorrect. Please try again" });
            return;
        }
        const hashPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
        try {
            const update = yield student_service_1.default.updatePassword(hashPassword, user.id);
            if (update) {
                (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: "Updated password" });
            }
        }
        catch (error) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: "Server Error" });
        }
    }),
    updateProfile: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const info = req.info;
        if (!info) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 404, data: "Not found your information" });
            return;
        }
        const { firstName, lastName, age, city, address, email, phoneNumber, image, birthday, gender } = req.body;
        if (email === info.email) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: "Email must be different from current email" });
            return;
        }
        if (phoneNumber === info.phone_number) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: "Phone number must be different from current phone number" });
            return;
        }
        const newInfo = {
            firstName,
            lastName,
            age,
            city,
            address,
            email,
            phoneNumber,
            image,
            birthday,
            gender,
            id: info.id,
        };
        try {
            const update = yield student_service_1.default.updateProfile(newInfo);
            if (update) {
                (0, handler_1.default)({ res, status: "success", statusCode: 200, data: "Updated information" });
            }
            else {
                (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: "Update failed" });
            }
        }
        catch (error) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 500, data: "Server Error" });
        }
    }),
    listExam: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const listExam = yield exam_service_1.default.Exams();
            if (listExam) {
                (0, handler_1.default)({ res, status: "success", statusCode: 200, data: listExam });
            }
            else {
                (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: "Not found list Exam" });
            }
        }
        catch (error) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: error });
        }
    }),
    getExam: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const examId = req.params.id;
        try {
            const getQuestion = yield exam_service_1.default.takeExam(examId);
            if (!getQuestion) {
                (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: "Currently not have question this exam" });
            }
            else {
                (0, handler_1.default)({ res, status: "success", statusCode: 200, data: getQuestion });
            }
        }
        catch (error) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 500, data: "Server Error" });
        }
    }),
    saveResult: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = req.results;
        if (!result) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 401, data: "Not found your information" });
            return;
        }
        try {
            const save = yield exam_service_1.default.saveResult(result);
            if (save === null || save === void 0 ? void 0 : save.affectedRows) {
                (0, handler_1.default)({ res, status: "success", statusCode: 200, data: result === null || result === void 0 ? void 0 : result.score });
            }
            else {
                (0, handler_1.default)({ res, status: "failed", statusCode: 400, data: "Not data save" });
            }
        }
        catch (error) {
            (0, handler_1.default)({ res, status: "failed", statusCode: 500, data: "Not data save" });
        }
    }),
};
exports.default = authController;
