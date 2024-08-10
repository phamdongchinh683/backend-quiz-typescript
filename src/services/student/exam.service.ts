import { ResultSetHeader, RowDataPacket } from "mysql2";
import Database from "../../config/config";
import IExamQuestion from "../../interface/IExamQuestion";
import IExam from "../../interface/IExam";
import IQuestion from "../../interface/IQuestion";
import IResult from "../../interface/IResult";
import { v4 as uuidv4 } from "uuid";

const mySql = Database.getInstance();
const connection = mySql.getPool();

const ExamService = {
  async examQuestion(id: string): Promise<IExamQuestion[] | null> {
    try {
      const [results, fields] = await connection.query<RowDataPacket[]>(
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
      return results as IExamQuestion[];
    } catch (error) {
      return null;
    }
  },
  async Exams(): Promise<IExam[] | null> {
    try {
      const statementType = "Select";
      const [results, fields] = await connection.query<RowDataPacket[]>(
        `CALL spExam(?, ?, ?,?,?,?,?);`,
        [null, null, null, null, null, null, statementType]
      );
      return results[0] as IExam[];
    } catch (error) {
      return null;
    }
  },
  async takeExam(testId: string): Promise<IQuestion[] | null> {
    try {
      const [results, fields] = await connection.query<RowDataPacket[]>(
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
      return results as IQuestion[];
    } catch (error) {
      return null;
    }
  },

  async saveResult(param: IResult): Promise<ResultSetHeader | null> {
    try {
      const [results, fields] = await connection.query(
        `INSERT INTO scores
        (id, exam_id, user_id, score, time, exam_date)
        VALUES (?, ?, ?, ?,?, ?)`,
        [uuidv4(), param.exam_id, param.user_id, param.score, param.time, param.exam_date]
      );
      return results as ResultSetHeader;
    } catch (error) {
      return null;
    }
  }
}

export default ExamService;
