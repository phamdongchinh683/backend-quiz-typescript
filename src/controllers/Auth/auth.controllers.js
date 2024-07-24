const bcrypt = require("bcrypt");
const { v4 } = require("uuid");

const connection = require("../../config/config");
const authMethod = require("./auth.methods");
const TokenSecret = process.env.ACCESS_TOKEN_SECRET;
const TokenLife = process.env.ACCESS_TOKEN_LIFE;
const Student = require("../../services/student/student.service");
const Exam = require("../../services/student/exam.service");
const { responseStatus } = require("../handler");
const saltRounds = 10;

exports.signup = async (req, res) => {
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
  } = req.user;
  try {
    const StatementType = "SignUp";
    const image = process.env.DEFAULT_AVATAR;
    const userID = v4();
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const signUp = await connection.query(
      `CALL spAuth(?,?,?,?,?,?,?,?,?,?,?,?)`,
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
    if (signUp[0].affectedRows === 1) {
      return responseStatus(
        res,
        200,
        "success",
        "Successfully created account"
      );
    } else {
      responseStatus(res, 400, "failed", "This account exists");
    }
  } catch (error) {
    console.error(`SQL error: ${error.message}`);
    return responseStatus(res, 500, "failed", error.message);
  }
};

exports.login = async (req, res) => {
  const { username, password, phoneNumber } = req.user;
  try {
    const StatementType = "Login";
    const [rows, fields] = await connection.query(
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
      return responseStatus(
        res,
        403,
        "failed",
        "username or password is correct"
      );
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return responseStatus(
        res,
        404,
        "failed",
        "The password that you've entered is incorrect."
      );
    } else {
      const dataForAccessToken = user.username || user.phone_number;
      const accessToken = await authMethod.generateToken(
        dataForAccessToken,
        TokenSecret,
        TokenLife
      );
      return responseStatus(res, 200, "success", accessToken);
    }
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("Type Error occurred:", error.message);
    } else if (error instanceof ReferenceError) {
      console.error("Reference error occurred:", error.message);
    } else {
      console.error("Error in verifying access token:", error.message);
    }
  }
};

exports.refreshToken = async (req, res) => {
  const { username, phoneNumber } = req.user;
  try {
    const refresh = await Student.decodeToken(username, phoneNumber);
    if (!refresh) {
      return responseStatus(res, 403, "failed", "Can't decode token");
    }
    const dataForAccessToken = refresh.username || refresh.phoneNumber;
    const accessToken = await authMethod.generateToken(
      dataForAccessToken,
      TokenSecret,
      TokenLife
    );

    if (!accessToken) {
      return responseStatus(res, 403, "failed", "Create access token failed");
    } else {
      return responseStatus(res, 403, "success", accessToken);
    }
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};

exports.viewProfile = async (req, res) => {
  const profile = req.user;
  try {
    if (!profile) {
      return responseStatus(res, 400, "failed", "Not found my profile! ");
    } else {
      return responseStatus(res, 200, "success", profile);
    }
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};

exports.examHistory = async (req, res) => {
  const user = req.user;
  try {
    const history = await Student.examHistory(user.id);
    if (history.length > 0) {
      return responseStatus(res, 200, "success", history);
    } else {
      return responseStatus(
        res,
        400,
        "failed",
        "There is no exam storage data"
      );
    }
  } catch (error) {
    return responseStatus(res, 400, "failed", "Server Error");
  }
};

exports.updatePassword = async (req, res) => {
  const info = req.user;
  const { password, newPassword } = req.body;

  const currentPassword = await bcrypt.compare(password, info.password);
  if (!currentPassword) {
    return responseStatus(
      res,
      400,
      "failed",
      "Current password is incorrect. Please try again."
    );
  }
  const hashPassword = await bcrypt.hash(newPassword, saltRounds);
  try {
    const update = await Student.updatePassword(hashPassword, info.id);
    console.log(update);
    if (update.affectedRows > 0) {
      return responseStatus(res, 200, "success", "Updated password");
    } else {
      return responseStatus(res, 400, "failed", "Failed");
    }
  } catch (error) {
    return responseStatus(res, 400, "failed", "Server Error");
  }
};

exports.updateProfile = async (req, res) => {
  const info = req.user;
  const {
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
  } = req.body;

  if (email === info.email) {
    return responseStatus(
      res,
      400,
      "failed",
      "Email must be different from current email"
    );
  }

  if (phoneNumber === info.phone_number) {
    return responseStatus(
      res,
      400,
      "failed",
      "Phone number must be different from current phone number"
    );
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
  console.log(newInfo);
  try {
    const updateProfile = await Student.updateProfile(newInfo);
    if (updateProfile.affectedRows > 0) {
      return responseStatus(res, 200, "success", "Updated profile");
    } else {
      console.log(updateProfile);
      return responseStatus(res, 400, "failed", "Failed to update profile");
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};
//Exam
exports.listExam = async (req, res) => {
  try {
    const listExam = await Exam.Exams();
    if (listExam.length > 0) {
      return responseStatus(res, 200, "success", listExam);
    } else {
      return responseStatus(res, 400, "failed", "Not found list Exam");
    }
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};

exports.getExam = async (req, res) => {
  const examId = req.params.id;
  try {
    const getQuestion = await Exam.takeExam(examId);
    if (getQuestion.length <= 0) {
      return responseStatus(
        res,
        400,
        "failed",
        "Currently not have question this exam"
      );
    } else {
      return responseStatus(res, 200, "success", getQuestion);
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
};

exports.saveResult = async (req, res) => {
  const newId = v4();
  const dataMiddleware = [
    req.score.score,
    req.score.examId,
    req.score.user,
    req.score.time,
    req.score.examDate,
  ];

  const [score, examId, user, examTime, examDate] = dataMiddleware;
  try {
    const save = await Exam.saveResult(
      newId,
      examId,
      user.id,
      score,
      examTime,
      examDate
    );
    if (save.affectedRows > 0) {
      return responseStatus(res, 200, "success", score);
    } else {
      return responseStatus(res, 400, "failed", "Not data save");
    }
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
