import { pool } from '../database/db.js';

// Contar Estudiantes
export const getTotalStudentsModel = async () => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM students');
        return parseInt(result.rows[0].count);
    } catch (error) {
        console.error("Error Students Model:", error.message);
        return 0;
    }
};

// Contar Usuarios
export const getTotalUsersModel = async () => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM users');
        return parseInt(result.rows[0].count);
    } catch (error) {
        return 0;
    }
};

// Contar Evaluaciones 
export const getTotalEvaluationsModel = async () => {
    try {
        const check = await pool.query("SELECT to_regclass('public.evaluations')");
        if (check.rows[0].to_regclass) {
             const count = await pool.query('SELECT COUNT(*) FROM evaluations');
             return parseInt(count.rows[0].count);
        }
        return 0;
    } catch (error) {
        return 0;
    }
};

// Datos para la Gráfica
export const getStudentRegistrationsGraphModel = async () => {
    try {
        const result = await pool.query(`
            SELECT TO_CHAR(created_at, 'Mon') as month, COUNT(*) as count 
            FROM students 
            WHERE created_at >= NOW() - INTERVAL '6 months'
            GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
            ORDER BY EXTRACT(MONTH FROM created_at)
        `);
        return result.rows;
    } catch (error) {
        return [];
    }
};