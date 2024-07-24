const connection = require("../../config/config");

class Exam {
  async examQuestion(id) {
    try {
      const [results, fields] = await connection.query(
        `select 
          q.id,
          category.id as category_id,
          q.correct_answer
      from 
        questions q 
      JOIN
          categories category on q.category_question = category.id
      WHERE 
        q.exam_id = ?`,
        [id]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async Exams() {
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
  async takeExam(testId) {
    try {
      const [results, fields] = await connection.query(
        `
    SELECT 
        qst.id, 
        qst.question_content,
        qst.answer_list
    FROM 
        questions qst 
    JOIN 
        categories ctgr on qst.category_question = ctgr.id
    JOIN 
        exams exam on qst.exam_id = exam.id
    WHERE 
        exam.id = ?
    ORDER BY 
        CASE 
            WHEN ctgr.name = 'Listening' THEN 1
            WHEN ctgr.name = 'Speaking' THEN 2
            ELSE 3
        END, 
        ctgr.name`,
        [testId]
      );
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async submitExam(values) {
    try {
      const [results, fields] = await connection.query(
        `INSERT INTO results
        (question_id, exam_id, user_id, result, date_exam)
        VALUES ?`,
        [values]
      );
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async saveResult(id, exam, user, score, time, examDate) {
    try {
      const [results, fields] = await connection.query(
        `INSERT INTO scores
        (id, exam_id, user_id, score, time, exam_date)
        VALUES (?, ?, ?, ?,?, ?)`,
        [id, exam, user, score, time, examDate]
      );
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new Exam();
