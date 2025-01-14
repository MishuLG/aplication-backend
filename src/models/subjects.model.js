import { pool } from '../database/db.js';


export const getAllSubjectsModel = async () => {
    const query = `SELECT * FROM subjects;`;
    const result = await pool.query(query);
    return result.rows;
};


export const getSubjectByIdModel = async (id) => {
    const query = `SELECT * FROM subjects WHERE id_subject = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};


export const createSubjectModel = async (subjectData) => {
    const { id_class_schedules, id_school_year, name_subject, description_subject } = subjectData;
    const query = `
        INSERT INTO subjects (id_class_schedules, id_school_year, name_subject, description_subject, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *;
    `;
    const result = await pool.query(query, [
        id_class_schedules,
        id_school_year,
        name_subject,
        description_subject
    ]);
    return result.rows[0];
};


export const updateSubjectByIdModel = async (id, subjectData) => {
    const { id_class_schedules, id_school_year, name_subject, description_subject } = subjectData;
    const query = `
        UPDATE subjects SET 
            id_class_schedules = COALESCE($1, id_class_schedules),
            id_school_year = COALESCE($2, id_school_year),
            name_subject = COALESCE($3, name_subject),
            description_subject = COALESCE($4, description_subject),
            updated_at = NOW()
        WHERE id_subject = $5 RETURNING *;
    `;
    const result = await pool.query(query, [
        id_class_schedules,
        id_school_year,
        name_subject,
        description_subject,
        id
    ]);
    return result.rows[0];
};


export const deleteSubjectByIdModel = async (id) => {
    const query = `DELETE FROM subjects WHERE id_subject = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};
