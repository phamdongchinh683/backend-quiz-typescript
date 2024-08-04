import { ResultSetHeader, RowDataPacket } from "mysql2";
import IPayload from "../../interface/IPayload";
import IUserProfile from '../../interface/IUserProfile';
import IRole from '../../interface/IRole';
import IExamHistory from '../../interface/IExamHistory';
import Database from '../../config/config';
import INewInfo from "../../interface/INewInfo";

const mySql = Database.getInstance();
const connection = mySql.getPool();

const StudentService = {

  async isStudent(param: IPayload): Promise<string | null> {
    try {
      const [results] = await connection.query<RowDataPacket[]>(
        `SELECT
            r.name AS role       
        from users u
        JOIN roles r on r.id = u.role_id
      where (u.username = ? OR u.phone_number = ?);
      `,
        [param.username,param.phoneNumber]
      );
      return results.length > 0 ? results[0].role : null;
    } catch (error) {
      return null;
    }
  },

  async roleStudent(payload: IPayload): Promise<IRole | null> {
    try {
      const [results, fields] = await connection.query<RowDataPacket[]>(
        `SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.age,
          u.city_name,
          u.address,
          u.username,
          u.password,
          u.email,
          u.phone_number,
          u.image,
          u.birth_day,
          u.gender,
          r.name AS role       
        from users u
        JOIN roles r on r.id = u.role_id
      where (u.username = ? OR u.phone_number = ?);
      `,
        [payload.username, payload.phoneNumber]
      );
      return results[0] as IRole;
    } catch (error) {
      return null;
    }
  },

  async updatePassword(newPassword: string, id: string): Promise<ResultSetHeader | null> {
    try {
      const [results, fields] = await connection.query<ResultSetHeader>(
        `UPDATE users
        SET password = ?
        WHERE id = ?;`,
        [newPassword, id]
      );
      return results as ResultSetHeader;
    } catch (error) {
      return null;
    }
  },

  async updateProfile(newInfo: INewInfo) :Promise<ResultSetHeader | null> {
    try {
      const [results, fields] = await connection.query<ResultSetHeader>(
        `UPDATE users
        SET first_name= ?, last_name= ?,  age= ? , city_name = ?,  address= ?,email=?, phone_number=?, image=? ,birth_day =? , gender =?
        WHERE id = ?;
      `,
        [
          newInfo.firstName,
          newInfo.lastName,
          newInfo.age,
          newInfo.city,
          newInfo.address,
          newInfo.email,
          newInfo.phoneNumber,
          newInfo.image,
          newInfo.birthday,
          newInfo.gender,
          newInfo.id
        ]
      );
      return results;
    } catch (error) {
      return null;
    }
  },

  async examHistory(param: string): Promise<IExamHistory[] | null> {
    try {
      const [results, fields] = await connection.query<RowDataPacket[]>(
        `
        SELECT 
        score.id, exam.name, score.user_id, score.score, score.time, score.exam_date
        FROM scores score
        JOIN exams exam on exam.id = score.exam_id
        WHERE user_id = ?
      `,
        [param]
      );
      if (results.length === 0){
        return null;
      }
      return results as IExamHistory[];
    } catch (error) {
      return null;
    }
  },

  async decodeToken(username: string, phoneNumber: string): Promise<IUserProfile | null> {
    try {
      const [results, fields] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM users s 
          WHERE s.username = ? or s.phone_number =? `,
        [username, phoneNumber]
      );
      return results[0] as  IUserProfile;
    } catch (error) {
      return null;
    }
  }
}

export default StudentService;
