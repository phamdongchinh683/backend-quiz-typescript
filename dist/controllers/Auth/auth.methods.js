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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const promisify = require("util").promisify;
const sign = promisify(jsonwebtoken_1.default.sign).bind(jsonwebtoken_1.default);
const verify = promisify(jsonwebtoken_1.default.verify).bind(jsonwebtoken_1.default);
const authMethod = {
    generateToken: (payload, secretSignature, tokenLife) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield sign({
                payload,
            }, secretSignature, {
                algorithm: "HS256",
                expiresIn: tokenLife,
            });
        }
        catch (error) {
            if (error instanceof TypeError) {
                console.error("Type Error occurred:", error.message);
            }
            else if (error instanceof ReferenceError) {
                console.error("Reference error occurred:", error.message);
            }
            else {
                console.error("Not create accessToken");
            }
            return null;
        }
    }),
    verifyToken: (token, secretKey) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield verify(token, secretKey, {
                ignoreExpiration: false,
            });
        }
        catch (error) {
            if (error instanceof TypeError) {
                console.error("Type Error occurred:", error.message);
            }
            else if (error instanceof ReferenceError) {
                console.error("Reference error occurred:", error.message);
            }
            else {
                console.error("Error in verifying access token:", error);
            }
            return null;
        }
    }),
    decodeToken: (token, secretKey) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield verify(token, secretKey, {
                ignoreExpiration: false,
            });
        }
        catch (error) {
            if (error instanceof TypeError) {
                console.error("Type Error occurred:", error.message);
            }
            else if (error instanceof ReferenceError) {
                console.error("Reference error occurred:", error.message);
            }
            else {
                console.error(`Error in decode access token: ${error}`);
            }
            return null;
        }
    }),
};
exports.default = authMethod;
