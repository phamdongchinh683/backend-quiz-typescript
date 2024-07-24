const connection = require("../../config/config");

class Question {
  async addQuestion(infoQuestion) {
    try {
      const query = `
        INSERT INTO questions
        (id, question_content, category_question, exam_id, answer_list, correct_answer)
        VALUES ?`;
      const [results, fields] = await connection.query(query, [infoQuestion]);
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async removeQuestion(questionIds) {
    try {
      const fluctuations = questionIds.map(() => "?").join(",");
      const deleteQuestion = `DELETE FROM questions WHERE id IN (${fluctuations})`;
      const [results, fields] = await connection.query(
        deleteQuestion,
        questionIds
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async updateQuestion(info) {
    const statementType = "Update";
    try {
      const [results, fields] = await connection.query(
        ` CALL spQuestion(?, ?, ?,?,?,?,?,?);`,
        [
          info.id,
          info.question,
          info.skill,
          info.language,
          info.test,
          info.answerList,
          info.correctAnswer,
          statementType,
        ]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async questionList() {
    const statementType = "Select";
    try {
      const [results, fields] = await connection.query(
        ` CALL spQuestion(?, ?, ?,?,?,?,?,?);`,
        [null, null, null, null, null, null, null, statementType]
      );
      return results[0];
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}

module.exports = new Question();
