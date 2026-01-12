import { pool } from '../database/db.js';


export const checkDuplicateNewsletterModel = async (uid_users, title, date_sent, excludeId = null) => {
    let query = `
        SELECT id_newsletters 
        FROM newsletters 
        WHERE uid_users = $1 AND title = $2 AND date_sent = $3::date
    `;
    const params = [uid_users, title, date_sent];

    if (excludeId) {
        query += ` AND id_newsletters != $4`;
        params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
};

export const getAllNewslettersModel = async () => {
    const query = `
        SELECT 
            n.id_newsletters,
            n.uid_users,
            u.first_name, 
            u.last_name,
            u.email,
            n.title,
            n.content,
            TO_CHAR(n.date_sent, 'YYYY-MM-DD') AS date_sent,
            n.newsletter_status,
            n.recipients,
            TO_CHAR(n.created_at, 'YYYY-MM-DD') AS created_at,
            TO_CHAR(n.updated_at, 'YYYY-MM-DD') AS updated_at
        FROM newsletters n
        INNER JOIN users u ON n.uid_users = u.uid_users
        ORDER BY n.date_sent DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getNewsletterByIdModel = async (id) => {
    const query = `
        SELECT 
            n.id_newsletters,
            n.uid_users,
            u.first_name, 
            u.last_name,
            n.title,
            n.content,
            TO_CHAR(n.date_sent, 'YYYY-MM-DD') AS date_sent,
            n.newsletter_status,
            n.recipients
        FROM newsletters n
        INNER JOIN users u ON n.uid_users = u.uid_users 
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
    const { uid_users, title, content, date_sent, newsletter_status, recipients } = newsletterData;

    const query = `
        UPDATE newsletters SET 
            uid_users = COALESCE($1, uid_users),
            title = COALESCE($2, title),
            content = COALESCE($3, content),
            date_sent = COALESCE($4::date, date_sent),
            newsletter_status = COALESCE($5, newsletter_status),
            recipients = COALESCE($6, recipients),
            updated_at = CURRENT_DATE
        WHERE id_newsletters = $7 RETURNING *;
    `;

    const result = await pool.query(query, [uid_users, title, content, date_sent, newsletter_status, recipients, id]);
    return result.rows[0];
};

export const deleteNewsletterByIdModel = async (id) => {
    const query = `
        DELETE FROM newsletters WHERE id_newsletters = $1 RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};