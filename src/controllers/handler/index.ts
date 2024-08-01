import { Response } from "express";
import IResponse from "../../interface/IResponse";

const responseStatus = ({ res, status, statusCode, data }: IResponse): Response => {
  if (status === "success") {
    return res.status(statusCode).json({
      status: status,
      data: data,
    });
  } else {
    return res.status(statusCode).json({
      status: status,
      message: data,
    });
  }
};

export default responseStatus;
