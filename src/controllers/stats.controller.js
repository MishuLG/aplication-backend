import { pool } from '../database/db.js';

export const getDashboardStats = async (req, res) => {
    console.log("--- INICIANDO CARGA DE DASHBOARD ---");
    
    const stats = {
        students: 0,
        users: 0,
        evaluations: 0,
        attendance: 0,
        registrationsChart: [],
        attendanceChart: []
    };

    try {
        // 1. KPI: ESTUDIANTES
        try {
            const res = await pool.query('SELECT COUNT(*) FROM students');
            stats.students = parseInt(res.rows[0].count);
            console.log("✅ Estudiantes cargados:", stats.students);
        } catch (e) {
            console.error("❌ Error cargando Estudiantes (verifica tabla 'students'):", e.message);
        }

        // 2. KPI: USUARIOS
        try {
            const res = await pool.query('SELECT COUNT(*) FROM users');
            stats.users = parseInt(res.rows[0].count);
            console.log("✅ Usuarios cargados:", stats.users);
        } catch (e) {
            console.error("❌ Error cargando Usuarios (verifica tabla 'users'):", e.message);
        }

        // 3. KPI: EVALUACIONES
        try {
            const res = await pool.query('SELECT COUNT(*) FROM evaluations');
            stats.evaluations = parseInt(res.rows[0].count);
            console.log("✅ Evaluaciones cargadas:", stats.evaluations);
        } catch (e) {
            console.error("⚠️ Error cargando Evaluaciones (tabla 'evaluations' no existe o vacía):", e.message);
        }

        // 4. KPI: ASISTENCIA (Cálculo)
        try {
            const res = await pool.query("SELECT COUNT(*) FROM attendance WHERE status = 'Present' OR status = '1'");
            const attendanceCount = parseInt(res.rows[0].count);
            const percentage = stats.students > 0 
                ? Math.round((attendanceCount / (stats.students * 20)) * 100) 
                : 0;
            stats.attendance = percentage;
            console.log("✅ Asistencia calculada:", percentage + "%");
        } catch (e) {
            console.error("⚠️ Error cargando Asistencia (posiblemente falta tabla 'attendance'):", e.message);
        }

        // 5. GRÁFICA: REGISTROS (Students)
        try {
            const res = await pool.query(`
                SELECT TO_CHAR(created_at, 'Mon') as month, COUNT(*) as count 
                FROM students 
                WHERE created_at >= NOW() - INTERVAL '6 months'
                GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
                ORDER BY EXTRACT(MONTH FROM created_at)
            `);
            stats.registrationsChart = res.rows;
            console.log("✅ Gráfica Estudiantes cargada");
        } catch (e) {
            console.error("❌ Error Gráfica Estudiantes (verifica columna 'created_at'):", e.message);
        }

        // 6. GRÁFICA: ASISTENCIA
        try {
            const res = await pool.query(`
                SELECT TO_CHAR(date_attendance, 'Dy') as day, COUNT(*) as value 
                FROM attendance 
                WHERE date_attendance >= NOW() - INTERVAL '5 days' 
                GROUP BY date_attendance 
                ORDER BY date_attendance
            `);
            stats.attendanceChart = res.rows;
        } catch (e) {
             console.log("ℹ️ Sin datos recientes para gráfica de asistencia.");
        }

        // RESPUESTA FINAL
        res.json({
            kpi: {
                students: stats.students,
                users: stats.users,
                attendance: stats.attendance + "%", 
                evaluations: stats.evaluations
            },
            charts: {
                registrations: stats.registrationsChart, 
                attendance: stats.attendanceChart 
            }
        });

    } catch (error) {
        console.error("💥 Error General en Dashboard:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};