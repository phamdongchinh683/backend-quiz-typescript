"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus = ({ res, status, statusCode, data }) => {
    if (status === "success") {
        return res.status(statusCode).json({
            status: status,
            data: data,
        });
    }
    else {
        return res.status(statusCode).json({
            status: status,
            message: data,
        });
    }
};
exports.default = responseStatus;
