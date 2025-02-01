import { pool } from '../database/db.js';

export const getAllNewslettersModel = async () => {
    const query = `
        SELECT 
            id_newsletters,
            uid_users,
            title,
            content,
            TO_CHAR(date_sent, 'YYYY-MM-DD') AS date_sent,
            newsletter_status,
            recipients,
            TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at,
            TO_CHAR(updated_at, 'YYYY-MM-DD') AS updated_at
        FROM newsletters;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getNewsletterByIdModel = async (id) => {
    const query = `
        SELECT 
            id_newsletters,
            uid_users,
            title,
            content,
            TO_CHAR(date_sent, 'YYYY-MM-DD') AS date_sent,
            newsletter_status,
            recipients,
            TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at,
            TO_CHAR(updated_at, 'YYYY-MM-DD') AS updated_at
        FROM newsletters 
        WHERE id_newsletters = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const createNewsletterModel = async (newsletterData) => {
    const { uid_users, title, content, date_sent, newsletter_status, recipients } = newsletterData;

    const query = `
        INSERT INTO newsletters (uid_users, title, content, date_sent, newsletter_status, recipients, created_at, updated_at)
        VALUES ($1, $2, $3, $4::date, $5, $6, CURRENT_DATE, CURRENT_DATE) RETURNING *;
    `;

    const result = await pool.query(query, [uid_users, title, content, date_sent, newsletter_status, recipients]);
    return result.rows[0];
};

export const updateNewsletterByIdModel = async (id, newsletterData) => {
    const { title, content, date_sent, newsletter_status, recipients } = newsletterData;

    const query = `
        UPDATE newsletters SET 
            title = COALESCE($1, title),
            content = COALESCE($2, content),
            date_sent = COALESCE($3::date, date_sent),
            newsletter_status = COALESCE($4, newsletter_status),
            recipients = COALESCE($5, recipients),
            updated_at = CURRENT_DATE
        WHERE id_newsletters = $6 RETURNING *;
    `;

    const result = await pool.query(query, [title, content, date_sent, newsletter_status, recipients, id]);
    return result.rows[0];
};

export const deleteNewsletterByIdModel = async (id) => {
    const query = `
        DELETE FROM newsletters WHERE id_newsletters = $1 RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};
