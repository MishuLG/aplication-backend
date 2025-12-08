import { pool } from '../database/db.js';


export const checkDuplicateStudentModel = async (idTutor, firstName, lastName, dob, excludeId = null) => {
    let query = `
        SELECT id_student 
        FROM students 
        WHERE id_tutor = $1              
          AND first_name = $2            
          AND last_name = $3           
          AND date_of_birth_student = $4::date
    `;
    const params = [idTutor, firstName, lastName, dob];

    if (excludeId) {
        query += ` AND id_student != $5`;
        params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
};

export const getAllStudentsModel = async () => {
    const query = `
        SELECT 
            s.id_student,
            s.id_tutor, 
            t.uid_users AS tutor_user_id, 
            s.id_section,
            s.id_school_year,
            s.first_name AS first_name_student,
            s.last_name AS last_name_student,
            s.health_record,
            s.gender,
            s.street,
            s.city,
            s.zip_code,
            TO_CHAR(s.date_of_birth_student, 'YYYY-MM-DD') AS date_of_birth_student,
            TO_CHAR(s.created_at, 'YYYY-MM-DD') AS created_at,
            TO_CHAR(s.updated_at, 'YYYY-MM-DD') AS updated_at
        FROM students s
        LEFT JOIN tutors t ON s.id_tutor = t.id_tutor
        ORDER BY s.last_name ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getStudentByIdModel = async (id) => {
    const query = `
        SELECT 
            s.*, 
            TO_CHAR(s.date_of_birth_student, 'YYYY-MM-DD') AS date_of_birth_student
        FROM students s
        WHERE s.id_student = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const createStudentModel = async (studentData) => {
    const {
        first_name_student, last_name_student, date_of_birth_student, 
        health_record, gender, street, city, zip_code, 
        id_tutor, id_section, id_school_year
    } = studentData;

    const query = `
        INSERT INTO students (
            first_name, last_name, date_of_birth_student, 
            health_record, gender, street, city, zip_code, 
            id_tutor, id_section, id_school_year, 
            created_at, updated_at
        )
        VALUES ($1, $2, $3::date, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_DATE, CURRENT_DATE) 
        RETURNING *;
    `;
    const result = await pool.query(query, [
        first_name_student, last_name_student, date_of_birth_student, 
        health_record, gender, street, city, zip_code, 
        id_tutor, id_section, id_school_year
    ]);
    return result.rows[0];
};

export const updateStudentByIdModel = async (id, studentData) => {
    const { 
        first_name_student, last_name_student, date_of_birth_student, 
        health_record, gender, street, city, zip_code, 
        id_tutor, id_section, id_school_year 
    } = studentData;

    const query = `
        UPDATE students SET 
            first_name = COALESCE($1, first_name),
            last_name = COALESCE($2, last_name),
            date_of_birth_student = COALESCE($3::date, date_of_birth_student),
            health_record = COALESCE($4, health_record),
            gender = COALESCE($5, gender),
            street = COALESCE($6, street),
            city = COALESCE($7, city),
            zip_code = COALESCE($8, zip_code),
            id_tutor = COALESCE($9, id_tutor),
            id_section = COALESCE($10, id_section),
            id_school_year = COALESCE($11, id_school_year),
            updated_at = CURRENT_DATE
        WHERE id_student = $12 
        RETURNING *;
    `;
    const result = await pool.query(query, [
        first_name_student, last_name_student, date_of_birth_student, 
        health_record, gender, street, city, zip_code, 
        id_tutor, id_section, id_school_year, id
    ]);
    return result.rows[0];
};

export const deleteStudentByIdModel = async (id) => {
    const query = `DELETE FROM students WHERE id_student = $1 RETURNING id_student;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};