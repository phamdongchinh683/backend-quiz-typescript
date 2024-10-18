"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Auth_1 = __importDefault(require("./Auth"));
// import routerAdmin from "../routers/Admin";
function routerApp(app) {
    app.use("/api/v1/auth", Auth_1.default);
    // app.use("/api/admin", routerAdmin);
    // app.use("/api/user", (req:any, res:any) => res.send('User route'));
}
module.exports = routerApp;
