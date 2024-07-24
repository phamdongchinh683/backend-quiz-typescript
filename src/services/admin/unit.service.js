const connection = require("../../config/config");

class Unit {
  async unitList() {
    const statementType = "Select";
    try {
      const [results, fields] = await connection.query(
        ` CALL spUnit(?, ?, ?,?,?,?)`,
        [null, null, null, null, null, statementType]
      );
      return results[0];
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async addUnit(id, title, courseName, lessonName, unit) {
    const statementType = "Insert";
    try {
      const [results, fields] = await connection.query(
        ` CALL spUnit(?, ?, ?,?,?,?)`,
        [id, title, courseName, lessonName, unit, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async updateUnit(id, newTitle, newCourseName, newLessonName, newUnit) {
    const statementType = "Update";
    try {
      const [results, fields] = await connection.query(
        ` CALL spUnit(?, ?, ?,?,?,?)`,
        [id, newTitle, newCourseName, newLessonName, newUnit, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async removeUnit(id) {
    const statementType = "Delete";
    try {
      const [results, fields] = await connection.query(
        ` CALL spUnit(?, ?, ?,?,?,?)`,
        [id, null, null, null, null, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}

module.exports = new Unit();
