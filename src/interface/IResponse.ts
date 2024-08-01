import { Response } from "express";

export default interface IResponse {
    res: Response,
    status: string; 
    statusCode: number;
    data: any;
}
