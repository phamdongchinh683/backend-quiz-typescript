const connection = require("../../config/config");

class Role {
  async roleList() {
    const statementType = "Select";
    try {
      const [results, fields] = await connection.query(
        ` CALL spRole(?, ?, ?);`,
        [null, null, statementType]
      );
      return results[0];
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async addRole(id, role) {
    const statementType = "Insert";
    try {
      const [results, fields] = await connection.query(
        ` CALL spRole(?, ?, ?);`,
        [id, role, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async updateRole(id, newRole) {
    const statementType = "Update";
    try {
      const [results, fields] = await connection.query(
        ` CALL spRole(?, ?, ?);`,
        [id, newRole, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async removeRole(id) {
    const statementType = "Delete";
    try {
      const [results, fields] = await connection.query(
        ` CALL spRole(?, ?, ?);`,
        [id, null, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}

module.exports = new Role();
