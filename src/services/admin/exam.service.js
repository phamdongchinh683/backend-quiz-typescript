const connection = require("../../config/config");

class Exam {
  async examList() {
    try {
      const statementType = "Select";
      const [results, fields] = await connection.query(
        `CALL spExam(?, ?, ?,?,?,?,?);`,
        [null, null, null, null, null, null, statementType]
      );
      return results[0];
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async addExam(infoExam) {
    try {
      const statementType = "Insert";
      const [results, fields] = await connection.query(
        `CALL spExam(?, ?, ?,?,?,?,?);`,
        [
          infoExam.id,
          infoExam.nameExam,
          infoExam.language,
          infoExam.time,
          infoExam.questionQuantity,
          infoExam.audio,
          statementType,
        ]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async removeExam(id) {
    try {
      const statementType = "Delete";
      const [results, fields] = await connection.query(
        `CALL spExam(?, ?, ?,?,?,?,?);`,
        [id, null, null, null, null, null, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async updateExam(infoExam) {
    try {
      const statementType = "Update";
      const [results, fields] = await connection.query(
        `CALL spExam(?, ?, ?,?,?,?,?);`,
        [
          infoExam.id,
          infoExam.name,
          infoExam.language,
          infoExam.time,
          infoExam.quantity,
          infoExam.audio,
          statementType,
        ]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}

module.exports = new Exam();
