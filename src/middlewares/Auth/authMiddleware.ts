import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import authMethod from "../../controllers/Auth/auth.methods";
import responseStatus from "../../controllers/handler/index";
import StudentService from "../../services/student/student.service";
// import Exam from "../../services/student/exam.service";
import IPayload from '../../interface/IPayload';
import IUserRequest from "../../interface/IUserRequest";
import INewUser from "../../interface/INewUser";

const TokenSecret = process.env.ACCESS_TOKEN_SECRET;

const authMiddleware = {

  authorization: async (req: IUserRequest, res: Response, next: NextFunction) => {
    const authorizationToken = req.headers["token"];
    if (!authorizationToken) {
      return responseStatus({ res, status: "failed", statusCode: 401, data: "Unauthorized!" });
    }
    try {
      const verified = await authMethod.verifyToken(authorizationToken, TokenSecret);
      if (!verified) {
        return responseStatus({ res, status: "failed", statusCode: 403, data: "You do not have access!" });
      }
      const payload: IPayload = {
        username: verified.payload,
        phoneNumber: verified.payload
      }
      req.user = payload;
      next();
    } catch (error) {
      return responseStatus({ res, status: "failed", statusCode: 403, data: "Failed to authenticate token." });
    }
  },
  
  signUpData: async (req: IUserRequest, res: Response, next: NextFunction) => {
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
      role,
    }: INewUser = req.body;

    function checkPasswordStrength(password: string) {
      let strength = 0;
      let tips = "";
      if (password.length < 8) {
        tips += "Make the password longer. ";
      } else {
        strength += 1;
      }

      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        strength += 1;
      } else {
        tips += "Use both lowercase and uppercase letters. ";
      }

      if (password.match(/\d/)) {
        strength += 1;
      } else {
        tips += "Include at least one number. ";
      }

      if (password.match(/[^a-zA-Z\d]/)) {
        strength += 1;
      } else {
        tips += "Include at least one special character. ";
      }

      if (strength < 2) {
        return { strength: "Easy to guess", tips };
      } else if (strength === 2) {
        return { strength: "Medium difficulty", tips };
      } else if (strength === 3) {
        return { strength: "Difficult", tips };
      } else {
        return { strength: "Extremely difficult", tips };
      }
    }

    function checkUsername(username: string) {
      let strength = 0;
      let tips = "";
      if (username.length < 8) {
        tips += "Make the username longer. ";
      } else {
        strength += 1;
      }

      if (username.match(/[a-z]/) && username.match(/[A-Z]/)) {
        strength += 1;
      } else {
        tips += "Use both lowercase and uppercase letters. ";
      }

      if (username.match(/\d/)) {
        strength += 1;
      } else {
        tips += "Include at least one number. ";
      }

      if (username.match(/[^a-zA-Z\d]/)) {
        strength += 1;
      } else {
        tips += "Include at least one special character. ";
      }

      if (strength < 2) {
        return { strength: "Easy to guess", tips };
      } else if (strength === 2) {
        return { strength: "Medium difficulty", tips };
      } else if (strength === 3) {
        return { strength: "Difficult", tips };
      } else {
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
  },

  isStudent: async (req: Request, res: Response, next: NextFunction) => {
    const role = await StudentService.isStudent(req.body);
    if (role === "student") {
      next();
    } else {
      responseStatus({res, status: "failed", statusCode: 401, data: "just only student can login!"});
    }
  },

  roleStudent: async (req: IUserRequest, res: Response, next: NextFunction) => {
    const payload = req.user;
    if (!payload) {
      return responseStatus({res, status: "failed", statusCode: 401, data: "Unauthorized"});
    }   
    const student = await StudentService.roleStudent(payload); 
    if (student?.role === "student") {
      req.info = student;
      next();
    } else {
      return responseStatus({res, status: "failed", statusCode: 401, data: "Only students can access"});
    }
  }

  // submitResults: async (req: IUserRequest, res: Response, next: NextFunction) => {
  //   const payload = req.user;
  //   if (!payload) {
  //     return responseStatus({res, status: "failed", statusCode: 401, data: "Unauthorized"});
  //   }   
  //   const examId = req.params.id;
  //   const { results, examTime, examDate } = req.body;

  //   try {
  //     const values = results.map((value: any) => [
  //       value.questionId,
  //       examId,
  //       user.id,
  //       value.result,
  //       value.examDate,
  //     ]);

  //     if (values.length > 0) {
  //       req.results = {
  //         values,
  //         examId,
  //         results,
  //         user,
  //         time: examTime,
  //         examDate,
  //       };
  //       next();
  //     } else {
  //       responseStatus(res, 400, "failed", "Please select an answer before submitting your answer");
  //     }
  //   } catch (error) {
  //     responseStatus(res, 500, "failed", "Internal server error");
  //   }
  // },

  // examResult: async (req: Request, res: Response, next: NextFunction) => {
  //   const dataMiddleware = [
  //     req.results.values,
  //     req.results.examId,
  //     req.results.results,
  //     req.results.user,
  //     req.results.time,
  //     req.results.examDate,
  //   ];
  //   const [values, examId, answers, user, time, examDate] = dataMiddleware;

  //   const questions = await Exam.examQuestion(examId);

  //   let totalPoints = 0;

  //   if (answers.length === 0) {
  //     totalPoints = 0;
  //   } else {
  //     for (let answer of answers) {
  //       let question = questions.find((q) => q.id === answer.questionId);
  //       if (question) {
  //         const isCorrect = await bcrypt.compare(answer.result, question.correct_answer);
  //         if (isCorrect === true) {
  //           totalPoints += 0.25;
  //         }
  //       }
  //     }
  //   }

  //   try {
  //     const submitResults = await Exam.submitExam(values);
  //     if (submitResults.affectedRows > 0) {
  //       req.score = {
  //         examId,
  //         user,
  //         score: totalPoints,
  //         time,
  //         examDate,
  //       };
  //       next();
  //     } else {
  //       responseStatus(res, 400, "failed", "Failed to submit answer");
  //     }
  //   } catch (error) {
  //     responseStatus(res, 500, "failed", "Internal server error");
  //   }
  // },
};

export default authMiddleware;
