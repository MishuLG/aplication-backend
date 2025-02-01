import { pool } from '../database/db.js';

export const getAllClassSchedulesModel = async () => {
    const query = `
        SELECT 
            id_class_schedules,
            TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
            TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
            classroom,
            day_of_week,
            start_time,
            end_time,
            unforeseen_events,
            TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at,
            TO_CHAR(updated_at, 'YYYY-MM-DD') AS updated_at
        FROM class_schedules;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getClassScheduleByIdModel = async (id) => {
    const query = `
        SELECT 
            id_class_schedules,
            TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
            TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
            classroom,
            day_of_week,
            start_time,
            end_time,
            unforeseen_events,
            TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at,
            TO_CHAR(updated_at, 'YYYY-MM-DD') AS updated_at
        FROM class_schedules
        WHERE id_class_schedules = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const createClassScheduleModel = async (scheduleData) => {
    const { start_date, end_date, classroom, day_of_week, start_time, end_time, unforeseen_events } = scheduleData;

    const query = `
        INSERT INTO class_schedules (start_date, end_date, classroom, day_of_week, start_time, end_time, unforeseen_events, created_at, updated_at)
        VALUES ($1::date, $2::date, $3, $4, $5, $6, $7, CURRENT_DATE, CURRENT_DATE) RETURNING *;
    `;
    const result = await pool.query(query, [
        start_date,
        end_date,
        classroom,
        day_of_week,
        start_time,
        end_time,
        unforeseen_events
    ]);
    return result.rows[0];
};

export const updateClassScheduleByIdModel = async (id, scheduleData) => {
    const { start_date, end_date, classroom, day_of_week, start_time, end_time, unforeseen_events } = scheduleData;

    const query = `
        UPDATE class_schedules SET 
            start_date = COALESCE($1::date, start_date),
            end_date = COALESCE($2::date, end_date),
            classroom = COALESCE($3, classroom),
            day_of_week = COALESCE($4, day_of_week),
            start_time = COALESCE($5, start_time),
            end_time = COALESCE($6, end_time),
            unforeseen_events = COALESCE($7, unforeseen_events),
            updated_at = CURRENT_DATE
        WHERE id_class_schedules = $8 RETURNING *;
    `;
    const result = await pool.query(query, [
        start_date,
        end_date,
        classroom,
        day_of_week,
        start_time,
        end_time,
        unforeseen_events,
        id
    ]);
    return result.rows[0];
};

export const deleteClassScheduleByIdModel = async (id) => {
    const query = `DELETE FROM class_schedules WHERE id_class_schedules = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};
