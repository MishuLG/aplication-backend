import { Student, User, Evaluation, Attendance } from '../models/Sequelize/index.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta donde se guardarán las imágenes (Asegúrate de crear src/public/carousel)
const CAROUSEL_DIR = path.join(__dirname, '../public/carousel');

// --- LÓGICA DEL CARRUSEL ---

// Obtener imágenes actuales
export const getCarouselImages = async (req, res) => {
    try {
        if (!fs.existsSync(CAROUSEL_DIR)) {
            fs.mkdirSync(CAROUSEL_DIR, { recursive: true });
        }
        
        // Buscamos archivos slide-1.jpg, slide-2.jpg, slide-3.jpg
        const images = [];
        for (let i = 1; i <= 3; i++) {
            const fileName = `slide-${i}.jpg`;
            const filePath = path.join(CAROUSEL_DIR, fileName);
            if (fs.existsSync(filePath)) {
                // Añadimos timestamp para evitar caché del navegador
                images.push({ id: i, url: `/public/carousel/${fileName}` });
            } else {
                // Imagen por defecto si no existe
                images.push({ id: i, url: null }); 
            }
        }
        res.json(images);
    } catch (error) {
        console.error("Error obteniendo imágenes:", error);
        res.status(500).json({ message: "Error al cargar carrusel" });
    }
};

// Subir y optimizar imagen
export const updateCarouselImage = async (req, res) => {
    try {
        const { slot } = req.params; // 1, 2 o 3
        
        if (!req.file) return res.status(400).json({ message: "No se subió ninguna imagen" });
        if (!['1', '2', '3'].includes(slot)) return res.status(400).json({ message: "Slot inválido" });

        if (!fs.existsSync(CAROUSEL_DIR)) {
            fs.mkdirSync(CAROUSEL_DIR, { recursive: true });
        }

        const fileName = `slide-${slot}.jpg`;
        const outputPath = path.join(CAROUSEL_DIR, fileName);

        // USAMOS SHARP PARA REDIMENSIONAR Y OPTIMIZAR (Evita archivos pesados)
        await sharp(req.file.buffer)
            .resize(1280, 720, { // Resolución estándar agradable
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 80 }) // Compresión JPEG optimizada
            .toFile(outputPath);

        // Al usar el mismo nombre (slide-1.jpg), el archivo viejo se sobrescribe automáticamente.
        // No se genera basura.

        res.json({ message: "Imagen actualizada", url: `/public/carousel/${fileName}?t=${Date.now()}` });

    } catch (error) {
        console.error("Error subiendo imagen:", error);
        res.status(500).json({ message: "Error procesando la imagen" });
    }
};

// --- LÓGICA EXISTENTE DEL DASHBOARD (MANTENIDA) ---

export const getDashboardStats = async (req, res) => {
    try {
        console.log("⚡ Calculando datos del Dashboard...");

        const today = new Date();
        const firstDayCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const totalStudents = await Student.count({ where: { status: 'active' } });
        const studentsBeforeThisMonth = await Student.count({ 
            where: { status: 'active', createdAt: { [Op.lt]: firstDayCurrentMonth } } 
        });
        
        let studentGrowth = 0;
        if (studentsBeforeThisMonth > 0) {
            studentGrowth = ((totalStudents - studentsBeforeThisMonth) / studentsBeforeThisMonth) * 100;
        } else if (totalStudents > 0) studentGrowth = 100;

        const totalUsers = await User.count();
        const totalEvaluations = await Evaluation.count();

        const totalAttendance = await Attendance.count();
        const presentAttendance = await Attendance.count({ where: { status: 'Presente' } });
        const attendancePercentage = totalAttendance > 0 
            ? ((presentAttendance / totalAttendance) * 100).toFixed(1) 
            : "0";

        const recentAttendance = await Attendance.findAll({
            where: { attendance_date: { [Op.gte]: sevenDaysAgo } },
            attributes: ['attendance_date', 'status']
        });

        const attendanceMap = {};
        recentAttendance.forEach(att => {
            const dayStr = new Date(att.attendance_date).toISOString().split('T')[0];
            if (!attendanceMap[dayStr]) attendanceMap[dayStr] = { total: 0, present: 0 };
            attendanceMap[dayStr].total++;
            if (att.status === 'Presente') attendanceMap[dayStr].present++;
        });

        const attendanceGraph = Object.entries(attendanceMap).map(([day, data]) => ({
            day, 
            value: data.total > 0 ? ((data.present / data.total) * 100).toFixed(1) : 0
        })).sort((a, b) => a.day.localeCompare(b.day));

        const studentsData = await Student.findAll({
            attributes: ['enrollment_date'],
            where: { status: 'active' },
            order: [['enrollment_date', 'ASC']]
        });

        const dailyRegistrations = {};
        const monthlyRegistrations = {};

        studentsData.forEach(student => {
            if (student.enrollment_date) {
                const date = new Date(student.enrollment_date);
                const dateStr = date.toISOString().split('T')[0];
                const monthKey = dateStr.substring(0, 7);

                monthlyRegistrations[monthKey] = (monthlyRegistrations[monthKey] || 0) + 1;
                if (date >= thirtyDaysAgo) {
                    dailyRegistrations[dateStr] = (dailyRegistrations[dateStr] || 0) + 1;
                }
            }
        });

        const registrationsDailyGraph = Object.entries(dailyRegistrations)
            .map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));

        const registrationsMonthlyGraph = Object.entries(monthlyRegistrations)
            .map(([month, count]) => ({ month, count })).sort((a, b) => a.month.localeCompare(b.month));

        res.json({
            kpi: {
                students: totalStudents,
                studentGrowth: studentGrowth.toFixed(1),
                users: totalUsers,
                evaluations: totalEvaluations,
                attendance: attendancePercentage + "%"
            },
            charts: {
                registrationsDaily: registrationsDailyGraph,
                registrationsMonthly: registrationsMonthlyGraph,
                attendance: attendanceGraph
            }
        });

    } catch (error) {
        console.error("❌ Error en Dashboard Controller:", error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};