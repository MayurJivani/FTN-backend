
const pool = require('../config/database');

const insertFeedback = async (user_id, response) => {
  const query = `
    INSERT INTO feedback (user_id, responses)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [user_id, response];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const listFeedback = async () => {
  const query = `
    SELECT f.responses, u.username, u.batch_id, u.profile_pic 
    FROM feedback f
    JOIN users u ON f.user_id = u.user_id;
  `;
  const result = await pool.query(query);

  // Create a map to group responses by user
  const feedbackMap = new Map();

  result.rows.forEach(row => {
    const userKey = row.username + row.batch_id;

    if (!feedbackMap.has(userKey)) {
      feedbackMap.set(userKey, {
        user: {
          username: row.username,
          batch_id: row.batch_id,
          profile_pic: row.profile_pic
        },
        responses: []
      });
    }

    feedbackMap.get(userKey).responses.push(row.responses);
  });

  return Array.from(feedbackMap.values()).map(userFeedback => {
    userFeedback.responses.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return userFeedback;
  });
};




module.exports = {
  insertFeedback,
  listFeedback,
};
