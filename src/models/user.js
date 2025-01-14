import pool from '../database/db.js';

export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

export const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE uid_users = $1', [id]);
    return result.rows[0];
};

export const createUser = async (userData) => {
    const { id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender, status = true } = userData;
    
    const result = await pool.query(
        `INSERT INTO users (uid_users, id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender, created_at, updated_at, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW(), $11) 
         RETURNING *`,
        [generateUid(), id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender, status]
    );
    return result.rows[0];
};


const generateUid = () => {
    return Math.random().toString(36).substr(2, 9); 
};

export const deleteUserById = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE uid_users = $1 RETURNING *', [id]);
    return result.rowCount > 0;
};

export const updateUserById = async (id, userData) => {
    const { id_rols, first_name, last_name, dni, number_tlf, email, password, date_of_birth, gender } = userData;

    const result = await pool.query(
        `UPDATE users SET 
            id_rols = COALESCE($1,id_rols), 
            first_name = COALESCE($2,last_name), 
            last_name = COALESCE($3,last_name), 
            dni = COALESCE($4,dni),
            number_tlf = COALESCE($5,numer_tlf),
            email = COALESCE($6,email),
            password = COALESCE($7,password),
            date_of_birth = COALESCE($8,date_of_birth),
            gender = COALESCE($9,gender),
            updated_at = NOW() 
         WHERE uid_users = $10 RETURNING *`,
        [id_rols || null,
         first_name || null,
         last_name || null,
         dni || null,
         number_tlf || null,
         email || null,
         password || null,
         date_of_birth || null,
         gender || null,
         id]
    );
    
    return result.rows[0];
};
