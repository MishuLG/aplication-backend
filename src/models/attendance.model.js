import { pool } from '../database/db.js';

export const getAllAttendanceModel = async () => {
    const query = `
        SELECT 
            a.id_attendance,
            a.id_student,
            s.first_name_student || ' ' || s.last_name_student AS student_name,
            a.id_section,
            sec.num_section AS section_name,
            TO_CHAR(a.attendance_date, 'YYYY-MM-DD') AS attendance_date,
            a.status,
            a.remarks,
            TO_CHAR(a.created_at, 'YYYY-MM-DD') AS created_at,
            TO_CHAR(a.updated_at, 'YYYY-MM-DD') AS updated_at
        FROM attendance a
        JOIN students s ON a.id_student = s.id_student
        JOIN section sec ON a.id_section = sec.id_section;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getAttendanceByIdModel = async (id) => {
    const query = `
        SELECT 
            a.id_attendance,
            a.id_student,
            s.first_name_student || ' ' || s.last_name_student AS student_name,
            a.id_section,
            sec.num_section AS section_name,
            TO_CHAR(a.attendance_date, 'YYYY-MM-DD') AS attendance_date,
            a.status,
            a.remarks,
            TO_CHAR(a.created_at, 'YYYY-MM-DD') AS created_at,
            TO_CHAR(a.updated_at, 'YYYY-MM-DD') AS updated_at
        FROM attendance a
        JOIN students s ON a.id_student = s.id_student
        JOIN section sec ON a.id_section = sec.id_section
        WHERE a.id_attendance = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const createAttendanceModel = async (attendanceData) => {
    const { id_student, id_section, attendance_date, status, remarks } = attendanceData;

    const query = `
        INSERT INTO attendance (id_student, id_section, attendance_date, status, remarks, created_at, updated_at)
        VALUES ($1, $2, $3::date, $4, $5, CURRENT_DATE, CURRENT_DATE) RETURNING *;
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
        UPDATE attendance SET 
            id_student = COALESCE($1, id_student),
            id_section = COALESCE($2, id_section),
            attendance_date = COALESCE($3::date, attendance_date),
            status = COALESCE($4, status),
            remarks = COALESCE($5, remarks),
            updated_at = CURRENT_DATE
        WHERE id_attendance = $6 RETURNING *;
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
    const query = `DELETE FROM attendance WHERE id_attendance = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};
