const pool = require('../config/database');

const Mentor = {
  addMentor: async ({ name, email, phoneno, profile_pic, forte }) => {
    const result = await pool.query(
      'INSERT INTO mentors (name, email, phoneno, profile_pic, forte) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phoneno, profile_pic, forte]
    );
    return result.rows[0];
  },

  getAllMentors: async () => {
    const result = await pool.query('SELECT * FROM mentors');
    return result.rows;
  }
};

module.exports = Mentor;
