import { pool } from '../database/db.js';

export const checkDuplicateAttendanceModel = async (studentId, date, excludeId = null) => {
    let query = `
        SELECT attendance_id 
        FROM attendances 
        WHERE student_id = $1 
          AND attendance_date = $2::date
    `;
    const params = [studentId, date];

    if (excludeId) {
        query += ` AND attendance_id != $3`;
        params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0; 
};

export const getAllAttendanceModel = async () => {
    const query = `
        SELECT 
            a.attendance_id AS id_attendance,
            a.student_id AS id_student,
            -- s.first_name || ' ' || s.last_name AS student_name, 
            a.class_schedule_id AS id_section,
            -- sec.num_section AS section_name, 
            TO_CHAR(a.attendance_date, 'YYYY-MM-DD') AS attendance_date,
            a.attendance_status AS status,
            a.observations AS remarks
        FROM attendances a
        ORDER BY a.attendance_date DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getAttendanceByIdModel = async (id) => {
    const query = `
        SELECT 
            a.attendance_id AS id_attendance,
            a.student_id AS id_student,
            a.class_schedule_id AS id_section,
            TO_CHAR(a.attendance_date, 'YYYY-MM-DD') AS attendance_date,
            a.attendance_status AS status,
            a.observations AS remarks
        FROM attendances a
        WHERE a.attendance_id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const createAttendanceModel = async (attendanceData) => {
    const { id_student, id_section, attendance_date, status, remarks } = attendanceData;

    const query = `
        INSERT INTO attendances (student_id, class_schedule_id, attendance_date, attendance_status, observations)
        VALUES ($1, $2, $3::date, $4, $5) 
        RETURNING 
            attendance_id AS id_attendance,
            student_id AS id_student,
            class_schedule_id AS id_section,
            TO_CHAR(attendance_date, 'YYYY-MM-DD') AS attendance_date,
            attendance_status AS status,
            observations AS remarks;
    `;
    
    const result = await pool.query(query, [
        id_student,
        id_section, 
        attendance_date,
        status,
        remarks
    ]);
    return result.rows[0];
};

export const updateAttendanceByIdModel = async (id, attendanceData) => {
    const { id_student, id_section, attendance_date, status, remarks } = attendanceData;

    const query = `
        UPDATE attendances SET 
            student_id = COALESCE($1, student_id),
            class_schedule_id = COALESCE($2, class_schedule_id),
            attendance_date = COALESCE($3::date, attendance_date),
            attendance_status = COALESCE($4, attendance_status),
            observations = COALESCE($5, observations)
        WHERE attendance_id = $6 
        RETURNING 
            attendance_id AS id_attendance,
            student_id AS id_student,
            class_schedule_id AS id_section,
            TO_CHAR(attendance_date, 'YYYY-MM-DD') AS attendance_date,
            attendance_status AS status,
            observations AS remarks;
    `;
    const result = await pool.query(query, [
        id_student,
        id_section,
        attendance_date,
        status,
        remarks,
        id
    ]);
    return result.rows[0];
};

export const deleteAttendanceByIdModel = async (id) => {
    const query = `DELETE FROM attendances WHERE attendance_id = $1 RETURNING attendance_id;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};