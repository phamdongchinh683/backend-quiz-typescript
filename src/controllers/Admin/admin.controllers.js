const { v4 } = require("uuid");
const bcrypt = require("bcrypt");

const Admin = require("../../services/admin/admin.service");
const Language = require("../../services/admin/language.service");
const Unit = require("../../services/admin/unit.service");
const Exam = require("../../services/admin/exam.service");
const Question = require("../../services/admin/question.service");
const Level = require("../../services/admin/level.service");
const Course = require("../../services/admin/course.service");
const testSkill = require("../../services/admin/categories.service");
const Role = require("../../services/admin/role.service");
const Lesson = require("../../services/admin/lesson.service");
const Class = require("../../services/admin/class.service");
const { responseStatus } = require("../handler");
const saltRounds = 10;

exports.profile = async (req, res) => {
  const profile = req.user;
  try {
    if (profile) {
      return responseStatus(res, 200, "success", profile);
    } else {
      return responseStatus(res, 400, "failed", "Not found profile");
    }
  } catch (error) {
    return res.send({ message: "Internal Server Error" });
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
  try {
    const updateProfile = await Admin.updateProfile(newInfo);
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
    const update = await Admin.updatePassword(hashPassword, info.id);
    if (update.affectedRows > 0) {
      return responseStatus(res, 200, "success", "Updated password");
    } else {
      return responseStatus(res, 400, "failed", "Failed");
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.removeAvatar = async (req, res) => {
  const info = req.user;
  const defaultImage = process.env.DEFAULT_AVATAR;
  try {
    const remove = await Admin.removeAvatar(defaultImage, info.id);
    if (remove.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Deleted avatar");
    } else {
      return responseStatus(res, 400, "failed", "Empty");
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.languageList = async (req, res) => {
  try {
    const languages = await Language.languageList();
    if (languages.length > 0) {
      return responseStatus(res, 200, "success", languages);
    } else {
      return responseStatus(
        res,
        400,
        "failed",
        "There is currently no language list"
      );
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.addLanguage = async (req, res) => {
  const { newLanguage } = req.body;
  const newId = v4();
  try {
    const addLanguage = await Language.addLanguage(newId, newLanguage);
    if (addLanguage.affectedRows === 1) {
      return responseStatus(res, 200, "success", "Added");
    } else {
      return responseStatus(res, 400, "failed", "Exist this language");
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.updateLanguage = async (req, res) => {
  const languageId = req.params.id;
  const { newLanguage } = req.body;
  try {
    const updateLanguage = await Language.updateLanguage(
      languageId,
      newLanguage
    );
    if (updateLanguage.affectedRows === 1) {
      return responseStatus(res, 200, "success", "Updated");
    } else {
      return responseStatus(res, 400, "failed", "Duplicate");
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.removeLanguage = async (req, res) => {
  const languageId = req.params.id;
  try {
    const removeLanguage = await Admin.removeLanguage(languageId);
    if (removeLanguage.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Deleted");
    } else {
      return responseStatus(res, 400, "failed", "Empty");
    }
  } catch (error) {
    console.error(error.message);
    return res.send({ message: "Server Error" });
  }
};

exports.addExam = async (req, res) => {
  const newId = v4();
  const { nameExam, language, time, questionQuantity } = req.body;

  const infoExam = {
    id: newId,
    nameExam,
    language,
    time,
    questionQuantity,
  };
  try {
    const addExam = await Exam.addExam(infoExam);
    if (addExam.affectedRows === 1) {
      return responseStatus(res, 200, "success", "Added");
    } else {
      return responseStatus(res, 400, "failed", "Exist this Exam");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.examList = async (req, res) => {
  try {
    const exams = await Exam.examList();
    if (exams.length > 0) {
      return responseStatus(res, 200, "success", exams);
    } else {
      return responseStatus(
        res,
        400,
        "failed",
        "There is currently no Exam list"
      );
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.updateExam = async (req, res) => {
  const ExamId = req.params.id;
  const { newName, newLanguage, newTime, newQuantity } = req.body;

  const info = {
    id: ExamId,
    name: newName,
    language: newLanguage,
    time: newTime,
    quantity: newQuantity,
  };

  try {
    const updateExam = await Exam.updateExam(info);
    if (updateExam.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Updated");
    } else {
      return responseStatus(res, 400, "failed", "Duplicate");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.removeExam = async (req, res) => {
  const ExamId = req.params.id;
  try {
    const deleteExam = await Exam.removeExam(ExamId);
    if (deleteExam.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Deleted");
    } else {
      return responseStatus(res, 400, "failed", "Empty");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.skillTestList = async (req, res) => {
  try {
    const results = await testSkill.skills();
    if (results.length > 0) {
      return responseStatus(res, 200, "success", results);
    } else {
      return responseStatus(
        res,
        400,
        "failed",
        "There is currently no skill Exam list"
      );
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.addSkillTest = async (req, res) => {
  const newId = v4();
  const { point, name } = req.body;

  try {
    const addPoint = await testSkill.addTestSkill(newId, name, point);
    if (addPoint.affectedRows === 1) {
      return responseStatus(res, 200, "success", "Added");
    } else {
      return responseStatus(res, 400, "failed", "Exist this skill Exam");
    }
  } catch (error) {
    console.error(error.message);
    return res.send({ message: error.message });
  }
};

exports.updateSkillTest = async (req, res) => {
  const testSkillId = req.params.id;
  const { newPoint, newName } = req.body;
  try {
    const updatePoint = await testSkill.updateTestSkill(
      testSkillId,
      newName,
      newPoint
    );
    if (updatePoint.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Updated");
    } else {
      return responseStatus(res, 400, "failed", "Duplicate");
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.removeSkillTest = async (req, res) => {
  const testSkillId = req.params.id;
  try {
    const removeSkill = await testSkill.removeTestSkill(testSkillId);
    if (removeSkill.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Deleted");
    } else {
      return responseStatus(res, 400, "failed", "Empty");
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.questionList = async (req, res) => {
  try {
    const questions = await Question.questionList();
    if (questions.length > 0) {
      return responseStatus(res, 200, "success", questions);
    } else {
      return responseStatus(
        res,
        400,
        "failed",
        "There is currently no question list"
      );
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.addQuestion = async (req, res) => {
  const { questions } = req.body;
  const questionList = await Promise.all(
    questions.map(async (question) => {
      const hashCorrectAnswer = await bcrypt.hash(
        question.correctAnswer,
        saltRounds
      );
      return [
        v4(),
        question.content,
        question.skillName,
        question.nameExam,
        question.answerList,
        hashCorrectAnswer,
      ];
    })
  );
  try {
    const addQuestion = await Question.addQuestion(questionList);
    if (addQuestion.affectedRows > 1) {
      return responseStatus(res, 200, "success", "Added");
    } else {
      return responseStatus(res, 400, "failed", "Exist this question");
    }
  } catch (error) {
    console.error(error.message);
    return res.send({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  const questionId = req.params.id;
  const {
    newQuestion,
    newLanguage,
    newSkill,
    newExam,
    newAnswerList,
    newCorrectAnswer,
  } = req.body;
  const info = {
    id: questionId,
    question: newQuestion,
    skill: newSkill,
    language: newLanguage,
    Exam: newExam,
    answerList: newAnswerList,
    correctAnswer: newCorrectAnswer,
  };
  try {
    const updateExam = await Admin.updateQuestion(info);
    if (updateExam.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Updated");
    } else {
      return responseStatus(res, 400, "failed", "Duplicate");
    }
  } catch (error) {
    console.error("Error updating question:", error.message);
    return res.send({ message: error.message });
  }
};

exports.removeQuestion = async (req, res) => {
  const { questionIds } = req.body;
  const ids = questionIds.map((q) => q.id);
  try {
    const removeQuestion = await Question.removeQuestion(ids);
    if (removeQuestion.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Deleted");
    } else {
      return responseStatus(res, 400, "failed", "Empty");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.roleList = async (req, res) => {
  try {
    const roles = await Role.roleList();
    if (roles.length > 0) {
      return responseStatus(res, 200, "success", roles);
    } else {
      return responseStatus(
        res,
        400,
        "failed",
        "There is currently no role list"
      );
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.addRole = async (req, res) => {
  const newId = v4();
  const { role } = req.body;

  try {
    const addRole = await Role.addRole(newId, role);
    if (addRole.affectedRows === 1) {
      return responseStatus(res, 200, "success", "Added");
    } else {
      return responseStatus(res, 400, "failed", "This role exists");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.updateRole = async (req, res) => {
  const roleId = req.params.id;
  const { newRole } = req.body;
  try {
    const updateRole = await Role.updateRole(roleId, newRole);
    if (updateRole.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Updated");
    } else {
      return responseStatus(res, 400, "failed", "Duplicate");
    }
  } catch (error) {
    console.error(error.message);
    return res.send({ message: "Server Error" });
  }
};

exports.removeRole = async (req, res) => {
  const roleId = req.params.id;
  try {
    const removeRole = await Role.removeRole(roleId);
    if (removeRole.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Deleted");
    } else {
      return responseStatus(res, 400, "failed", "Empty");
    }
  } catch (error) {
    console.error(error.message);
    return res.send({ message: "Server Error" });
  }
};

exports.levelList = async (req, res) => {
  try {
    const levels = await Level.levelList();
    if (levels) {
      return responseStatus(res, 200, "success", levels);
    } else {
      return responseStatus(
        res,
        400,
        "failed",
        "There is currently no level list"
      );
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.addLevel = async (req, res) => {
  const newId = v4();
  const { name, code } = req.body;
  try {
    const addLevel = await Level.addLevel(newId, name, code);
    if (addLevel.affectedRows === 1) {
      return responseStatus(res, 200, "success", "Added");
    } else {
      return responseStatus(res, 400, "failed", "This level exists");
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.updateLevel = async (req, res) => {
  const levelId = req.params.id;
  const { name, code } = req.body;
  try {
    const update = await Level.updateLevel(levelId, name, code);
    if (update.affectedRows === 1) {
      return responseStatus(res, 200, "success", "Updated");
    } else {
      return responseStatus(res, 400, "failed", "Duplicate");
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.removeLevel = async (req, res) => {
  const levelId = req.params.id;
  try {
    const remove = await Admin.removeLevel(levelId);
    if (remove.affectedRows === 1) {
      return responseStatus(res, 200, "success", "Deleted");
    } else {
      return responseStatus(res, 400, "failed", "Empty");
    }
  } catch (error) {
    return res.send({ message: "Server Error" });
  }
};

exports.courseList = async (req, res) => {
  try {
    const courses = await Course.courseList();
    if (courses.length > 0) {
      return responseStatus(res, 200, "success", courses);
    } else {
      return responseStatus(
        res,
        400,
        "failed",
        "There is currently no course list"
      );
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.addCourse = async (req, res) => {
  const newId = v4();
  const { name, language, level, start, end, cost } = req.body;
  const infoAnswer = {
    id: newId,
    name: name,
    language: language,
    level: level,
    startDate: start,
    endDate: end,
    cost: cost,
  };
  try {
    const addCourse = await Course.addCourse(infoAnswer);
    if (addCourse.affectedRows === 1) {
      return responseStatus(res, 200, "success", "Added");
    } else {
      return responseStatus(res, 400, "failed", "Exist this course ");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const { name, language, level, start, end, cost } = req.body;
  const infoAnswer = {
    id: courseId,
    name: name,
    language: language,
    level: level,
    startDate: start,
    endDate: end,
    cost: cost,
  };
  try {
    const update = await Course.updateCourse(infoAnswer);
    if (update.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Updated");
    } else {
      return responseStatus(res, 400, "failed", "Failed");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.removeCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    const remove = await Course.removeCourse(courseId);
    if (remove.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Deleted");
    } else {
      return responseStatus(res, 400, "failed", "Empty");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.lessonList = async (req, res) => {
  try {
    const lessons = await Lesson.lessonList();
    if (lessons.length > 0) {
      return responseStatus(res, 200, "success", lessons);
    } else {
      return responseStatus(
        res,
        400,
        "failed",
        "There is currently no lesson list"
      );
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.addLesson = async (req, res) => {
  const newId = v4();
  const { code, name } = req.body;
  try {
    const addLesson = await Lesson.addLesson(newId, code, name);
    if (addLesson.affectedRows === 1) {
      return responseStatus(res, 200, "success", "Added");
    } else {
      return responseStatus(res, 400, "failed", "Exist this lesson ");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.updateLesson = async (req, res) => {
  const lessonId = req.params.id;
  const { code, name } = req.body;
  try {
    const update = await Lesson.updateLesson(lessonId, name, code);
    if (update.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Updated");
    } else {
      return responseStatus(res, 400, "failed", "Failed");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.removeLesson = async (req, res) => {
  const lessonId = req.params.id;
  try {
    const remove = await Lesson.removeLesson(lessonId);
    if (remove.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Deleted");
    } else {
      return responseStatus(res, 400, "failed", "Empty");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.unitList = async (req, res) => {
  try {
    const lessons = await Unit.unitList();
    if (lessons.length > 0) {
      return responseStatus(res, 200, "success", lessons);
    } else {
      return responseStatus(
        res,
        400,
        "failed",
        "There is currently no lesson list"
      );
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.addUnit = async (req, res) => {
  const newId = v4();
  const { courseName, lessonName, title, unit } = req.body;
  try {
    const addLesson = await Unit.addUnit(
      newId,
      title,
      courseName,
      lessonName,
      unit
    );
    if (addLesson.affectedRows === 1) {
      return responseStatus(res, 200, "success", "Added");
    } else {
      return responseStatus(res, 400, "failed", "Exist this unit ");
    }
  } catch (error) {
    console.log(error.message);
    return res.send({ message: error.message });
  }
};

exports.updateUnit = async (req, res) => {
  const unitId = req.params.id;
  const { newCourseName, newLessonName, newTitle, newUnit } = req.body;
  try {
    const update = await Unit.updateUnit(
      unitId,
      newTitle,
      newCourseName,
      newLessonName,
      newUnit
    );
    if (update.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Updated");
    } else {
      return responseStatus(res, 400, "failed", "Failed");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.removeUnit = async (req, res) => {
  const unitId = req.params.id;
  try {
    const remove = await Unit.removeUnit(unitId);
    if (remove.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Deleted");
    } else {
      return responseStatus(res, 400, "failed", "Empty");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.lessonContentList = async (req, res) => {
  try {
    const lessonContents = await Lesson.lessonContentList();
    if (lessonContents.length > 0) {
      return responseStatus(res, 200, "success", lessonContents);
    } else {
      return responseStatus(
        res,
        400,
        "failed",
        "There is currently no lesson content list"
      );
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.addContent = async (req, res) => {
  const newId = v4();
  const { content, unitName, lesson } = req.body;
  try {
    const addLesson = await Lesson.addContent(newId, content, unitName, lesson);
    if (addLesson.affectedRows === 1) {
      return responseStatus(res, 200, "success", "Added");
    } else {
      return responseStatus(res, 400, "failed", "Exist this unit ");
    }
  } catch (error) {
    console.log(error.message);
    return res.send({ message: error.message });
  }
};

exports.updateContent = async (req, res) => {
  const contentId = req.params.id;
  const { newContent, newUnit, newLesson } = req.body;
  try {
    const update = await Lesson.updateContent(
      contentId,
      newContent,
      newUnit,
      newLesson
    );
    if (update.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Updated");
    } else {
      return responseStatus(res, 400, "failed", "Failed");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.removeContent = async (req, res) => {
  const contentId = req.params.id;
  try {
    const remove = await Lesson.removeContent(contentId);
    if (remove.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Deleted");
    } else {
      return responseStatus(res, 400, "failed", "Empty");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.classList = async (req, res) => {
  try {
    const classes = await Class.classList();
    if (classes.length > 0) {
      return responseStatus(res, 200, "success", classes);
    } else {
      return responseStatus(
        res,
        400,
        "failed",
        "There is currently no lesson course class list"
      );
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.addClass = async (req, res) => {
  const newId = v4();
  const { name, courseName } = req.body;
  try {
    const addCourseClass = await Class.addClass(newId, name, courseName);
    if (addCourseClass.affectedRows === 1) {
      return responseStatus(res, 200, "success", "Added");
    } else {
      return responseStatus(res, 400, "failed", "Exist this course class ");
    }
  } catch (error) {
    console.log(error.message);
    return res.send({ message: error.message });
  }
};

exports.updateClass = async (req, res) => {
  const classId = req.params.id;
  const { newName, newCourseName } = req.body;
  try {
    const update = await Class.updateClass(classId, newName, newCourseName);
    if (update.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Updated");
    } else {
      return responseStatus(res, 400, "failed", "Failed");
    }
  } catch (error) {
    return res.send({ message: error.message });
  }
};

exports.removeClass = async (req, res) => {
  const classId = req.params.id;
  try {
    const remove = await Class.removeClass(classId);
    console.log(remove);
    if (remove.affectedRows !== 0) {
      return responseStatus(res, 200, "success", "Deleted");
    } else {
      return responseStatus(res, 400, "failed", "Empty");
    }
  } catch (error) {
    console.log(error.message);
    return res.send({ message: error.message });
  }
};
