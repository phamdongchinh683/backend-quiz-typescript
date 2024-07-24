const connection = require("../../config/config");

class Level {
  async levelList() {
    const statementType = "Select";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLevel(?, ?, ?,?);`,
        [null, null, null, statementType]
      );
      return results[0];
    } catch (error) {
      return error.message;
    }
  }

  async addLevel(id, name, code) {
    const statementType = "Insert";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLevel(?, ?, ?,?);`,
        [id, name, code, statementType]
      );
      return results;
    } catch (error) {
      return error.message;
    }
  }

  async updateLevel(id, name, code) {
    const statementType = "Update";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLevel(?, ?, ?,?);`,
        [id, name, code, statementType]
      );
      return results;
    } catch (error) {
      return error.message;
    }
  }

  async removeLevel(id) {
    const statementType = "Delete";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLevel(?, ?, ?,?);`,
        [id, null, null, statementType]
      );
      return results;
    } catch (error) {
      return error.message;
    }
  }
}

module.exports = new Level();
