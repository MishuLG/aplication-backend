import { pool } from '../database/db.js';

export const getTotalUsersModel = async () => {
    const query = `SELECT COUNT(*) AS total_users FROM users;`;
    const result = await pool.query(query);
    return result.rows[0].total_users;
};

export const getStudentRegistrationsByDayModel = async () => {
    const query = `
        SELECT DATE(created_at) AS registration_date, COUNT(*) AS total_students
        FROM students
        GROUP BY registration_date
        ORDER BY registration_date;
    `;
    const result = await pool.query(query);
    return result.rows;
};
