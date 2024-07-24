const bcrypt = require("bcrypt");

const authMethod = require("./auth.methods.js");
const TokenSecret = process.env.ACCESS_TOKEN_SECRET;
const Student = require("../../services/student/student.service.js");
const { responseStatus, calculateTime } = require("../handler/index.js");
const Exam = require("../../services/student/exam.service");

exports.authorization = async (req, res, next) => {
  const authorizationToken = req.headers["token"];
  if (!authorizationToken) {
    return responseStatus(res, 401, "failed", "Invalid authorization!");
  }
  try {
    const verified = await authMethod.verifyToken(
      authorizationToken,
      TokenSecret
    );
    if (!verified) {
      return responseStatus(res, 403, "failed", "You do not have access!");
    }
    const payload = {
      username: verified.payload,
      phoneNumber: verified.payload,
    };
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).send("Failed to authenticate token.");
  }
};

exports.inputSignup = async (req, res, next) => {
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
  } = req.body;

  function checkPasswordStrength(password) {
    var strength = 0;
    var tips = "";
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
      return { strength: "Easy to guess", tips: tips };
    } else if (strength === 2) {
      return { strength: "Medium difficulty", tips: tips };
    } else if (strength === 3) {
      return { strength: "Difficult", tips: tips };
    } else {
      return { strength: "Extremely difficult", tips: tips };
    }
  }
  function checkUsername(username) {
    var strength = 0;
    var tips = "";
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
      return { strength: "Easy to guess", tips: tips };
    } else if (strength === 2) {
      return { strength: "Medium difficulty", tips: tips };
    } else if (strength === 3) {
      return { strength: "Difficult", tips: tips };
    } else {
      return { strength: "Extremely difficult", tips: tips };
    }
  }
  if (
    !["Medium difficulty", "Difficult", "Extremely difficult"].includes(
      checkUsername(username).strength
    )
  ) {
    return res.json({
      error:
        "Username: " +
        checkUsername(username).strength +
        ". " +
        checkUsername(username).tips,
    });
  }
  if (
    !["Medium difficulty", "Difficult", "Extremely difficult"].includes(
      checkPasswordStrength(password).strength
    )
  ) {
    return res.json({
      error:
        "Password: " +
        checkPasswordStrength(password).strength +
        ". " +
        checkPasswordStrength(password).tips,
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
    return res.json({ Error: "type of age must be number " });
  }
  if (typeof address !== "string") {
    return res.json({ Error: "type of address must be string" });
  }
  if (typeof email !== "string" || !email.includes("@")) {
    return res.json("Error: type of email must be string and include '@'");
  }
  req.user = req.body;
  next();
};

exports.roleStudent = async (req, res, next) => {
  const student = await Student.roleStudent(req.user);
  if (student?.role === "student") {
    req.user = student;
    next();
  } else {
    return responseStatus(
      res,
      401,
      "failed",
      "Access Denied. Student only route!"
    );
  }
};

exports.isStudent = async (req, res, next) => {
  const student = await Student.roleStudent(req.body);
  if (student?.role === "student") {
    req.user = req.body;
    next();
  } else {
    return responseStatus(res, 401, "failed", "just only student can login!");
  }
};

exports.submitResults = async (req, res, next) => {
  const user = req.user;
  const examId = req.params.id;
  const { results, examTime, examDate } = req.body;

  try {
    const values = results.map((value) => [
      value.questionId,
      examId,
      user.id,
      value.result,
      value.examDate,
    ]);

    if (values.length > 0) {
      req.results = {
        values: values,
        examId: examId,
        results: results,
        user: user,
        time: examTime,
        examDate: examDate,
      };
      next();
    } else {
      return responseStatus(
        res,
        400,
        "failed",
        "Please select an answer before submitting your answer"
      );
    }
  } catch (error) {
    return responseStatus(res, 500, "failed", "Internal server error");
  }
};

exports.examResult = async (req, res, next) => {
  const dataMiddleware = [
    req.results.values,
    req.results.examId,
    req.results.results,
    req.results.user,
    req.results.time,
    req.results.examDate,
  ];
  const [values, examId, answers, user, time, examDate] = dataMiddleware;

  const questions = await Exam.examQuestion(examId);

  let totalPoints = 0;

  if (answers.length === 0) {
    return (totalPoints = 0);
  }

  for (let answer of answers) {
    let question = questions.find((q) => q.id === answer.questionId);
    if (question) {
      const isCorrect = await bcrypt.compare(
        answer.result,
        question.correct_answer
      );
      if (isCorrect === true) {
        totalPoints += 0.25;
      }
    }
  }

  try {
    const submitResults = await Exam.submitExam(values);
    if (submitResults.affectedRows > 0) {
      req.score = {
        examId: examId,
        user: user,
        score: totalPoints,
        time: time,
        examDate: examDate,
      };
      next();
    } else {
      return responseStatus(res, 400, "failed", "Failed to submit answer");
    }
  } catch (error) {
    console.log(error.message);
    return responseStatus(res, 500, "failed", "Internal server error");
  }
};
