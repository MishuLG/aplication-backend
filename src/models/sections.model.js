import { pool } from '../database/db.js';



export const getAllSectionsModel = async () => {
    const query = `SELECT * FROM section;`;
    const result = await pool.query(query);
    return result.rows;
};


export const getSectionByIdModel = async (id) => {
    const query = `SELECT * FROM section WHERE id_section = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};


export const createSectionModel = async (sectionData) => {
    const { id_class_schedules, num_section } = sectionData;
    const query = `
        INSERT INTO section (id_class_schedules, num_section, created_at, update_at)
        VALUES ($1, $2, NOW(), NOW()) RETURNING *;
    `;
    const result = await pool.query(query, [id_class_schedules, num_section]);
    return result.rows[0];
};


export const updateSectionByIdModel = async (id, sectionData) => {
    const { id_class_schedules, num_section } = sectionData;
    const query = `
        UPDATE section SET 
            id_class_schedules = COALESCE($1, id_class_schedules),
            num_section = COALESCE($2, num_section),
            update_at = NOW()
        WHERE id_section = $3 RETURNING *;
    `;
    const result = await pool.query(query, [id_class_schedules, num_section, id]);
    return result.rows[0];
};


export const deleteSectionByIdModel = async (id) => {
    const query = `DELETE FROM section WHERE id_section = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};
