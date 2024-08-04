import { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import responseStatus from "../handler";
import authMethod from "./auth.methods";
import StudentService from "../../services/student/student.service";
import IUserRequest from "../../interface/IUserRequest";
import IUserRequestBody from "../../interface/IUserRequestBody";
import ICreateUser from "../../interface/INewUser";
import IRole from "../../interface/IRole";
import Database from "../../config/config";
import INewInfo from "../../interface/INewInfo";

const saltRounds = 10;
const TokenSecret = process.env.ACCESS_TOKEN_SECRET;
const TokenLife = process.env.ACCESS_TOKEN_LIFE;

const mySql = Database.getInstance();
const connection = mySql.getPool();

const authController = {

  signup: async (req: IUserRequest, res: Response): Promise<void> => {
    if (!req.signup) {
      responseStatus({ res, status: "failed", statusCode: 400, data: "Signup data is not available" })
      return
    }
    const {
      firstName,
      lastName,
      age,
      address,
      username,
      password,
      email,
      city,
      phoneNumber,
      birthDay,
      gender,
      role,
    }: ICreateUser = req.signup; 

    try {
      const StatementType: string = "SignUp";
      const image = process.env.DEFAULT_AVATAR;
      const userID: string = uuidv4();
      const hashPassword: string = await bcrypt.hash(password, saltRounds);
      const [results] = await connection.query<ResultSetHeader>(
        `CALL spAuth(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
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
        ]
      );
      if (results) {
        responseStatus({ res, status: "success", statusCode: 200, data: "Successfully created account" })
      }
    } catch (error) {
      responseStatus({ res, status: "failed", statusCode: 500, data: "This account exists" })
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    const { username, password, phoneNumber }: IUserRequestBody = req.body;
    try {
      const StatementType: string = "Login";
      const [rows] = await connection.query<RowDataPacket[]>(
        `CALL spAuth(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
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
        ]
      );
      const user = rows[0][0];
      if (!user) {
        responseStatus({ res, status: "failed", statusCode: 403, data: "Username or password is incorrect" });
      }
      const passwordMatch: boolean = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        responseStatus({ res, status: "failed", statusCode: 404, data: "The password that you've entered is incorrect." });
      } else {
        const dataForAccessToken: object = user.username || user.phone_number;
        const accessToken: string = await authMethod.generateToken(dataForAccessToken, TokenSecret, TokenLife);
        responseStatus({ res, status: "success", statusCode: 200, data: accessToken });
      }
    } catch (error) {
      responseStatus({ res, status: "failed", statusCode: 500, data: "hehe" });
    }
  },

  refreshToken: async (req: Request, res: Response): Promise<void> => {
    const { username, phoneNumber } = req.body; 
    try {
      const refresh = await StudentService.decodeToken(username, phoneNumber);
      if (!refresh) {
        responseStatus({res, status: "failed", statusCode: 403, data: "Can't decode token"});
      }
      const data: any = refresh?.username || refresh?.phone_number;

      const accessToken: string = await authMethod.generateToken(data, TokenSecret, TokenLife);
      if (!accessToken) {
        responseStatus({res, status: "failed", statusCode: 403, data: "Create access token failed"});
      } else {
        responseStatus({res, status: "success", statusCode: 200, data: accessToken});
      }
    } catch (error) {
      responseStatus({res, status: "failed", statusCode: 500, data: error});
    }
  },
  
  profileView: async (req: IUserRequest, res: Response): Promise<void> => {
    const user = req.info;
    try {
      if (!user) {
         responseStatus({ res, status: "failed", statusCode: 400, data: "user not found!" });
      }
       responseStatus({ res, status: "success", statusCode: 200, data: user });
    } catch (error) {
       responseStatus({ res, status: "failed", statusCode: 500, data: "Internal server error" });
    }
  },

  examHistory: async (req: IUserRequest, res: Response): Promise<void> => {
    const user = req.info;
    if (!user) {
      responseStatus({ res, status: "failed", statusCode: 401, data: "Only students can access" });
      return
   }
    try {
      const history = await StudentService.examHistory(user.id);
      if (history) {
        responseStatus({ res, status: "success", statusCode: 200, data: history });
      } else {
        responseStatus({ res, status: "failed", statusCode: 400, data: "There is no exam storage data" });
      }
    } catch (error) {
      responseStatus({ res, status: "failed", statusCode: 400, data: "Server Error" });
    }
  },

  updatePassword: async (req: IUserRequest, res: Response): Promise<void> => {
    const user = req.info;
    const { password, newPassword } = req.body;
    if (!user) {
      responseStatus({ res, status: "failed", statusCode: 401, data: "Only students can access" });
      return
   }
    const currentPassword = await bcrypt.compare(password, user.password);
    if (!currentPassword) {
      responseStatus({ res, status: "failed", statusCode: 400, data: "Current password is incorrect. Please try again" });
      return
    }
    const hashPassword = await bcrypt.hash(newPassword, saltRounds);
    try {
      const update = await StudentService.updatePassword(hashPassword, user.id);
      if (update) {
        responseStatus({ res, status: "failed", statusCode: 400, data: "Updated password" });
      }
    } catch (error) {
      responseStatus({ res, status: "failed", statusCode: 400, data: "Server Error" });
    }
  },

  updateProfile: async (req: IUserRequest, res: Response): Promise<void> => {
    const info = req.info;

    if (!info) {
      responseStatus({ res, status: "failed", statusCode: 404, data: "Not found your information" });
      return;
    }

    const { firstName, lastName, age, city, address, email, phoneNumber, image, birthday, gender }: INewInfo = req.body;

    if (email === info.email) {
      responseStatus({ res, status: "failed", statusCode: 400, data: "Email must be different from current email" });
      return;
    }

    if (phoneNumber === info.phone_number) {
      responseStatus({ res, status: "failed", statusCode: 400, data: "Phone number must be different from current phone number" });
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
      const update = await StudentService.updateProfile(newInfo);
      if (update) {
        responseStatus({ res, status: "success", statusCode: 200, data: "Updated information" });
      } else {
        responseStatus({ res, status: "failed", statusCode: 400, data: "Update failed" });
      }
    } catch (error) {
      responseStatus({ res, status: "failed", statusCode: 500, data: "Server Error" });
    }
}


  // listExam: async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const listExam = await Exam.Exams();
  //     if (listExam.length > 0) {
  //        responseStatus(res, 200, "success", listExam);
  //     } else {
  //        responseStatus(res, 400, "failed", "Not found list Exam");
  //     }
  //   } catch (error) {
  //      responseStatus(res, 500, "failed", error.message);
  //   }
  // },

  // getExam: async (req: Request, res: Response): Promise<void> => {
  //   const examId = req.params.id;
  //   try {
  //     const getQuestion = await Exam.takeExam(examId);
  //     if (getQuestion.length <= 0) {
  //        responseStatus(res, 400, "failed", "Currently not have question this exam");
  //     } else {
  //        responseStatus(res, 200, "success", getQuestion);
  //     }
  //   } catch (error) {
  //      res.json({ message: error.message });
  //   }
  // },

  // saveResult:  async (req: Request, res: Response): Promise<void> => {
  //   const newId = uuidv4();
  //   const { score, examId, user, time, examDate } = req.body;

  //   try {
  //     const save = await Exam.saveResult(newId, examId, user.id, score, time, examDate);
  //     if (save.affectedRows > 0) {
  //        responseStatus(res, 200, "success", score);
  //     } else {
  //        responseStatus(res, 400, "failed", "Not data save");
  //     }
  //   } catch (error) {
  //      res.status(500).send({ message: "Internal server error" });
  //   }
  // },
};

export default authController;
