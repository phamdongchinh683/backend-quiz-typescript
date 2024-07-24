const connection = require("../../config/config");

class Admin {
  //role
  async roleAdmin(payload) {
    try {
      const [results, fields] = await connection.query(
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
      return results[0];
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async updateProfile(newInfo) {
    try {
      const [results, fields] = await connection.query(
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
          newInfo.birthDay,
          newInfo.gender,
          newInfo.id,
        ]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async updatePassword(newPassword, id) {
    console.log(id);
    try {
      const [results, fields] = await connection.query(
        `UPDATE users
        SET password = ?
        WHERE id = ?;`,
        [newPassword, id]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async removeAvatar(image, id) {
    try {
      const [results, fields] = await connection.query(
        `UPDATE users
        SET image=?
        WHERE id = ?;
      `,
        [image, id]
      );
      return results;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}

module.exports = new Admin();
