import { Request } from "express";
import ICreateUser from "./INewUser";
import IPayload from "./IPayload";
import IRole from "./IRole";

export default interface IUserRequest extends Request {
    user?: IPayload,
    signup?: ICreateUser,
    info?: IRole
}