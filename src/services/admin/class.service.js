const connection = require("../../config/config");

class CourseClass {
  async classList() {
    try {
      const statementType = "Select";
      const [results, fields] = await connection.query(
        `CALL spClass(?, ?, ?,?);`,
        [null, null, null, statementType]
      );
      return results[0];
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async addClass(newId, name, courseName) {
    try {
      const statementType = "Insert";
      const [results, fields] = await connection.query(
        `CALL spClass(?,?, ?, ?);`,
        [newId, name, courseName, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async updateClass(id, newName, newCourseName) {
    const statementType = "Update";
    try {
      const [results, fields] = await connection.query(
        ` CALL spClass(?,?, ?, ?);`,
        [id, newName, newCourseName, statementType]
      );
      return results;
    } catch (error) {
      return error.message;
    }
  }
  async removeClass(id) {
    const statementType = "Delete";
    try {
      const [results, fields] = await connection.query(
        ` CALL spClass(?,?, ?, ?)`,
        [id, null, null, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}

module.exports = new CourseClass();
