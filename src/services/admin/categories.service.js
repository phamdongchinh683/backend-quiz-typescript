const connection = require("../../config/config");

class Categories {
  async skillList() {
    try {
      const statementType = "Select";
      const [results, fields] = await connection.query(
        `CALL spTestSkill(?, ?, ?);`,
        [null, null, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async addTestSkill(id, name, point) {
    const statementType = "Insert";
    try {
      const [results, fields] = await connection.query(
        `CALL spTestSkill(?,?,?,?);`,
        [id, name, point, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async updateTestSkill(id, name, point) {
    const statementType = "Update";
    try {
      const [results, fields] = await connection.query(
        `CALL spTestSkill(?,?,?,?);`,
        [id, name, point, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async removeTestSkill(id) {
    const statementType = "Delete";
    try {
      const [results, fields] = await connection.query(
        `CALL spTestSkill(?,?,?,?);`,
        [id, null, null, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}

module.exports = new Categories();
