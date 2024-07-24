const connection = require("../../config/config");

class Lesson {
  async lessonList() {
    const statementType = "Select";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLesson(?, ?, ?,?)`,
        [null, null, null, statementType]
      );
      return results[0];
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async addLesson(id, code, name) {
    const statementType = "Insert";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLesson(?, ?, ?,?)`,
        [id, name, code, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async updateLesson(id, name, code) {
    const statementType = "Update";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLesson(?, ?, ?,?)`,
        [id, name, code, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async removeLesson(id) {
    const statementType = "Delete";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLesson(?, ?, ?,?)`,
        [id, null, null, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async lessonContentList() {
    const statementType = "Select";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLessonContent(?, ?, ?,?,?)`,
        [null, null, null, null, statementType]
      );
      return results[0];
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async addContent(id, content, unit, lesson) {
    const statementType = "Insert";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLessonContent(?, ?, ?,?,?)`,
        [id, content, unit, lesson, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async updateContent(id, content, unit, lesson) {
    const statementType = "Update";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLessonContent(?, ?, ?,?,?)`,
        [id, content, unit, lesson, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async removeContent(id) {
    const statementType = "Delete";
    try {
      const [results, fields] = await connection.query(
        ` CALL spLessonContent(?, ?, ?,?,?)`,
        [id, null, null, null, statementType]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}

module.exports = new Lesson();
