import { pool } from '../database/db.js';

export const getAllStudentsModel = async () => {
    const query = `
        SELECT 
            s.*,
            s.id_tutor, 
            t.uid_users AS tutor_user_id, 
            s.id_section,
            s.id_school_year
        FROM students s
        JOIN tutors t ON s.id_tutor = t.id_tutor
    `;
    const result = await pool.query(query);
    return result.rows;
};


export const getStudentByIdModel = async (id) => {
    const query = `
        SELECT 
            s.*, 
            s.id_tutor, 
            t.uid_users AS tutor_user_id,
            s.id_section,
            s.id_school_year
        FROM students s
        JOIN tutors t ON s.id_tutor = t.id_tutor
        WHERE s.id_student = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};


export const createStudentModel = async (studentData) => {
    const { first_name, last_name, date_of_birth, gender, address, id_tutor, id_section, id_school_year } = studentData;
    const query = `
        INSERT INTO students (first_name_student, last_name_student, date_of_birth_student, gender, address, id_tutor, id_section, id_school_year)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
    `;
    const result = await pool.query(query, [
        first_name, last_name, date_of_birth, gender, address, id_tutor, id_section, id_school_year
    ]);
    return result.rows[0];
};


export const updateStudentByIdModel = async (id, studentData) => {
    const { first_name_student, last_name_student, date_of_birth_student, gender, address, id_tutor, id_section, id_school_year } = studentData;
    const query = `
        UPDATE students SET 
            first_name_student = COALESCE($1, first_name_student),
            last_name_student = COALESCE($2, last_name_student),
            date_of_birth_student = COALESCE($3, date_of_birth_student),
            gender = COALESCE($4, gender),
            address = COALESCE($5, address),
            id_tutor = COALESCE($6, id_tutor),
            id_section = COALESCE($7, id_section),
            id_school_year = COALESCE($8, id_school_year),
            updated_at = NOW()
        WHERE id_student = $9 RETURNING *;
    `;
    const result = await pool.query(query, [
        first_name_student, last_name_student, date_of_birth_student, gender, address, id_tutor, id_section, id_school_year, id
    ]);
    return result.rows[0];
};


export const deleteStudentByIdModel = async (id) => {
    const query = `DELETE FROM students WHERE id_student = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};
