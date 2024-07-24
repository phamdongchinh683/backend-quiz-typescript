const connection = require("../../config/config");

class Course {
  async courseList() {
    const statementType = "Select";
    try {
      const [results, fields] = await connection.query(
        ` CALL spCourse(?, ?, ?,?, ?, ?,?,?);`,
        [null, null, null, null, null, null, null, statementType]
      );
      return results[0];
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async addCourse(info) {
    const statementType = "Insert";
    try {
      const [results, fields] = await connection.query(
        ` CALL spCourse(?, ?, ?,?, ?, ?,?,?);`,
        [
          info.id,
          info.name,
          info.language,
          info.level,
          info.startDate,
          info.endDate,
          info.cost,
          statementType,
        ]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async updateCourse(info) {
    const statementType = "Update";
    try {
      const [results, fields] = await connection.query(
        ` CALL spCourse(?, ?, ?,?, ?, ?,?,?);`,
        [
          info.id,
          info.name,
          info.language,
          info.level,
          info.startDate,
          info.endDate,
          info.cost,
          statementType,
        ]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async removeCourse(id) {
    const statementType = "Delete";
    try {
      const [results, fields] = await connection.query(
        ` CALL spCourse(?, ?, ?,?, ?, ?,?,?);`,
        [id, null, null, null, null, null, null, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}

module.exports = new Course();
