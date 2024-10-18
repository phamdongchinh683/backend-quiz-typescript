"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: 'GET,POST',
    allowedHeaders: ['Content-Type', 'Authorization']
};
exports.default = corsOptions;
