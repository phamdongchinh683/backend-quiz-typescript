const connection = require("../../config/config");

class Language {
  async languageList() {
    try {
      const statementType = "Select";
      const [results, fields] = await connection.query(
        `CALL spLanguage(?, ?, ?);`,
        [null, null, statementType]
      );
      return results[0];
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async addLanguage(newId, newLanguage) {
    try {
      const statementType = "Insert";
      const [results, fields] = await connection.query(
        `CALL spLanguage(?, ?, ?);`,
        [newId, newLanguage, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async updateLanguage(id, language) {
    const statementType = "Update";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLanguage(?, ?, ?);`,
        [id, language, statementType]
      );
      return results;
    } catch (error) {
      return error.message;
    }
  }
  async removeLanguage(id) {
    const statementType = "Delete";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLanguage(?, ?, ?);`,
        [id, null, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}

module.exports = new Language();
