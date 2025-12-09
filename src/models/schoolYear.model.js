import { pool } from '../database/db.js';

export const getAllSchoolYearsModel = async () => {
    const query = `
        SELECT 
            id_school_year,
            school_grade,
            TO_CHAR(start_year, 'YYYY-MM-DD') AS start_year,
            TO_CHAR(end_of_year, 'YYYY-MM-DD') AS end_of_year,
            number_of_school_days,
            TO_CHAR(scheduled_vacation, 'YYYY-MM-DD') AS scheduled_vacation,
            TO_CHAR(special_events, 'YYYY-MM-DD') AS special_events,
            school_year_status,
            TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at,
            TO_CHAR(updated_at, 'YYYY-MM-DD') AS updated_at
        FROM school_years
        ORDER BY start_year DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getSchoolYearByIdModel = async (id) => {
    const query = `SELECT * FROM school_years WHERE id_school_year = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

// --- VALIDACIÓN DE DUPLICADOS ---
export const checkDuplicateSchoolYearModel = async (school_grade, start_year, end_of_year, excludeId = null) => {
    let query = `
        SELECT id_school_year 
        FROM school_years 
        WHERE school_grade = $1 
          AND start_year = $2::date 
          AND end_of_year = $3::date
    `;
    const params = [school_grade, start_year, end_of_year];

    if (excludeId) {
        query += ` AND id_school_year != $4`;
        params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
};

export const createSchoolYearModel = async (data) => {
    const { school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status } = data;
    const query = `
        INSERT INTO school_years (school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, CURRENT_DATE)
        RETURNING *;
    `;
    const result = await pool.query(query, [school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status]);
    return result.rows[0];
};

export const updateSchoolYearByIdModel = async (id, data) => {
    const { school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status } = data;
    const query = `
        UPDATE school_years SET 
            school_grade = $1, start_year = $2, end_of_year = $3, 
            number_of_school_days = $4, scheduled_vacation = $5, 
            special_events = $6, school_year_status = $7, updated_at = CURRENT_DATE
        WHERE id_school_year = $8
        RETURNING *;
    `;
    const result = await pool.query(query, [school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status, id]);
    return result.rows[0];
};

export const deleteSchoolYearByIdModel = async (id) => {
    const query = `DELETE FROM school_years WHERE id_school_year = $1 RETURNING id_school_year;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};