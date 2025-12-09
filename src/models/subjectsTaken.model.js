import { pool } from '../database/db.js';

export const getAllSubjectsTakenModel = async () => {
    const query = `
        SELECT 
            st.id_subject_taken,
            st.id_student,
            s.first_name || ' ' || s.last_name AS student_name,
            st.id_subject,
            sub.name_subject,
            st.id_school_year,
            CONCAT(sy.start_year, ' - ', sy.end_of_year) AS school_year,
            st.final_grade,
            TO_CHAR(st.created_at, 'YYYY-MM-DD') AS created_at,
            TO_CHAR(st.updated_at, 'YYYY-MM-DD') AS updated_at
        FROM subjects_taken st
        JOIN students s ON st.id_student = s.id_student
        JOIN subjects sub ON st.id_subject = sub.id_subject
        JOIN school_years sy ON st.id_school_year = sy.id_school_year
        ORDER BY st.id_subject_taken DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getSubjectTakenByIdModel = async (id) => {
    const query = `
        SELECT 
            st.*,
            CONCAT(sy.start_year, ' - ', sy.end_of_year) AS school_year
        FROM subjects_taken st
        JOIN school_years sy ON st.id_school_year = sy.id_school_year
        WHERE st.id_subject_taken = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const getSubjectsTakenByStudentModel = async (id_student) => {
    const query = `
        SELECT 
            st.id_subject_taken,
            st.id_student,
            s.first_name || ' ' || s.last_name AS student_name,
            st.id_subject,
            sub.name_subject,
            sub.description_subject,
            st.id_school_year,
            st.final_grade,
            TO_CHAR(st.created_at, 'YYYY-MM-DD') AS created_at,
            TO_CHAR(st.updated_at, 'YYYY-MM-DD') AS updated_at
        FROM subjects_taken st
        JOIN students s ON st.id_student = s.id_student
        JOIN subjects sub ON st.id_subject = sub.id_subject
        WHERE st.id_student = $1;
    `;
    const result = await pool.query(query, [id_student]);
    return result.rows;
};

// --- VALIDACIÓN DE DUPLICADOS ---
export const checkDuplicateSubjectsTakenModel = async (id_student, id_subject, excludeId = null) => {
    let query = `
        SELECT id_subject_taken 
        FROM subjects_taken 
        WHERE id_student = $1 AND id_subject = $2
    `;
    const params = [id_student, id_subject];

    if (excludeId) {
        query += ` AND id_subject_taken != $3`;
        params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
};

export const createSubjectTakenModel = async (data) => {
    const { id_student, id_subject, id_school_year, final_grade } = data;
    const query = `
        INSERT INTO subjects_taken (id_student, id_subject, id_school_year, final_grade, created_at, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_DATE)
        RETURNING *;
    `;
    const result = await pool.query(query, [id_student, id_subject, id_school_year, final_grade]);
    return result.rows[0];
};

// --- FUNCIÓN DE ACTUALIZAR (Faltaba) ---
export const updateSubjectTakenByIdModel = async (id, data) => {
    const { id_student, id_subject, id_school_year, final_grade } = data;
    const query = `
        UPDATE subjects_taken
        SET id_student = $1, id_subject = $2, id_school_year = $3, final_grade = $4, updated_at = CURRENT_DATE
        WHERE id_subject_taken = $5
        RETURNING *;
    `;
    const result = await pool.query(query, [id_student, id_subject, id_school_year, final_grade, id]);
    return result.rows[0];
};

export const deleteSubjectTakenByIdModel = async (id) => {
    const query = `DELETE FROM subjects_taken WHERE id_subject_taken = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};