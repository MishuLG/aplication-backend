import { pool } from '../database/db.js';


export const checkDuplicateTutorModel = async (uidUsers, excludeId = null) => {
    let query = `
        SELECT id_tutor 
        FROM tutors 
        WHERE uid_users = $1
    `;
    const params = [uidUsers];


    if (excludeId) {
        query += ` AND id_tutor != $2`;
        params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
};


export const getAllTutorsModel = async () => {
    const query = `
        SELECT 
            t.id_tutor, 
            t.uid_users,
            u.first_name, 
            u.last_name,
            u.dni,
            u.email,
            TO_CHAR(t.created_at, 'YYYY-MM-DD') AS created_at,
            TO_CHAR(t.updated_at, 'YYYY-MM-DD') AS updated_at
        FROM tutors t
        INNER JOIN users u ON t.uid_users = u.uid_users
        ORDER BY t.id_tutor ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getTutorByIdModel = async (id) => {
    const query = `
        SELECT 
            t.id_tutor, 
            t.uid_users,
            u.first_name, 
            u.last_name,
            u.dni,
            u.email,
            TO_CHAR(t.created_at, 'YYYY-MM-DD') AS created_at,
            TO_CHAR(t.updated_at, 'YYYY-MM-DD') AS updated_at
        FROM tutors t 
        INNER JOIN users u ON t.uid_users = u.uid_users
        WHERE t.id_tutor = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const createTutorModel = async (tutorData) => {
    const { uid_users } = tutorData;
    const query = `
        INSERT INTO tutors (uid_users, created_at, updated_at)
        VALUES ($1, CURRENT_DATE, CURRENT_DATE) RETURNING *;
    `;
    const result = await pool.query(query, [uid_users]);
    return result.rows[0];
};

export const updateTutorByIdModel = async (id, tutorData) => {
    const { uid_users } = tutorData;
    const query = `
        UPDATE tutors SET 
            uid_users = COALESCE($1, uid_users),
            updated_at = CURRENT_DATE
        WHERE id_tutor = $2 RETURNING *;
    `;
    const result = await pool.query(query, [uid_users, id]);
    return result.rows[0];
};

export const deleteTutorByIdModel = async (id) => {
    const query = `DELETE FROM tutors WHERE id_tutor = $1 RETURNING id_tutor;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};