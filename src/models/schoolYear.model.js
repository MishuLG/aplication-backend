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
        FROM school_year;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getSchoolYearByIdModel = async (id) => {
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
        FROM school_year 
        WHERE id_school_year = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const createSchoolYearModel = async (schoolYearData) => {
    const { school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status } = schoolYearData;
  
    if (!start_year || !end_of_year) {
      throw new Error('Las fechas de inicio y fin son obligatorias.');
    }
  
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start_year) || !dateRegex.test(end_of_year)) {
      throw new Error('El formato de la fecha debe ser YYYY-MM-DD.');
    }
  
    const query = `
      INSERT INTO school_year (school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, created_at, updated_at, school_year_status)
      VALUES ($1, $2::date, $3::date, $4, $5::date, $6::date, CURRENT_DATE, CURRENT_DATE, $7) RETURNING *;
    `;
  
    const result = await pool.query(query, [
      school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status
    ]);
  
    return result.rows[0];
};

export const updateSchoolYearByIdModel = async (id, schoolYearData) => {
    const { school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status } = schoolYearData;
    
    const query = `
        UPDATE school_year SET 
            school_grade = COALESCE($1, school_grade),
            start_year = COALESCE($2::date, start_year),
            end_of_year = COALESCE($3::date, end_of_year),
            number_of_school_days = COALESCE($4, number_of_school_days),
            scheduled_vacation = COALESCE($5::date, scheduled_vacation),
            special_events = COALESCE($6::date, special_events),
            school_year_status = COALESCE($7, school_year_status),
            updated_at = CURRENT_DATE
        WHERE id_school_year = $8 RETURNING *;
    `;
    
    const result = await pool.query(query, [
        school_grade, start_year, end_of_year, number_of_school_days, scheduled_vacation, special_events, school_year_status, id
    ]);
    
    return result.rows[0];
};

export const deleteSchoolYearByIdModel = async (id) => {
    const query = `
        DELETE FROM school_year WHERE id_school_year = $1 RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};
