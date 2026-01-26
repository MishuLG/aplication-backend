import PDFDocument from "pdfkit-table";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { Enrollment, Student, Section, Grade, SchoolYear, Evaluation, Subject } from "../models/Sequelize/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateBulletinPDF = async (req, res) => {
    try {
        const { id_enrollment } = req.params;

        // 1. Buscar la inscripción
        const enrollmentData = await Enrollment.findOne({
            where: { id_enrollment },
            include: [
                { model: Student },
                { model: Section, include: [Grade, SchoolYear] }
            ]
        });

        if (!enrollmentData) {
            return res.status(404).json({ message: "Inscripción no encontrada" });
        }

        const student = enrollmentData.Student;
        const section = enrollmentData.Section;

        // 2. BUSCAR NOTAS (EVALUACIONES)
        const evaluations = await Evaluation.findAll({
            where: { id_student: student.id_student },
            include: [{ model: Subject }]
        });

        // 3. CÁLCULO INTELIGENTE DE PROMEDIOS
        const subjectsMap = {};

        evaluations.forEach(ev => {
            const subjectName = ev.Subject.name_subject;
            if (!subjectsMap[subjectName]) {
                subjectsMap[subjectName] = { sum: 0, count: 0 };
            }
            subjectsMap[subjectName].sum += parseFloat(ev.score);
            subjectsMap[subjectName].count += 1;
        });

        // Variables para el Promedio General
        let sumOfSubjectAverages = 0;
        let numberOfSubjects = 0;

        // Preparar filas y calcular General
        const tableRows = Object.keys(subjectsMap).map(subject => {
            const subjectAvg = subjectsMap[subject].sum / subjectsMap[subject].count;
            
            // Acumulamos para el promedio general
            sumOfSubjectAverages += subjectAvg;
            numberOfSubjects++;

            return [
                subject,
                subjectAvg.toFixed(2),
                subjectAvg >= 10 ? "Aprobado" : "Reprobado"
            ];
        });

        // CALCULAR PROMEDIO GENERAL AL VUELO (Ignora la BD si está en 0)
        const calculatedGeneralAvg = numberOfSubjects > 0 
            ? (sumOfSubjectAverages / numberOfSubjects).toFixed(2) 
            : "0.00";

        if (tableRows.length === 0) {
            tableRows.push(["Sin notas registradas", "-", "-"]);
        }

        // 4. Generar PDF
        const doc = new PDFDocument({ margin: 72, size: 'LETTER' });

        res.setHeader("Content-Type", "application/pdf");
        const filename = `Boletin_${student.last_name || 'Estudiante'}.pdf`;
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

        doc.pipe(res);

        // --- ENCABEZADO ---
        const logoPath = path.join(__dirname, '../assets/logo.png'); 
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 72, 50, { width: 60 });
        }

        doc.moveDown(1);
        doc.font('Times-Roman').fontSize(14).text('UNIDAD EDUCATIVA "Francis de Miranda"', { align: 'center', bold: true });
        doc.fontSize(12).text('Informe de Rendimiento Académico', { align: 'center' });
        const periodo = section.SchoolYear ? section.SchoolYear.name_period : 'Periodo Actual';
        doc.text(`Año Escolar: ${periodo}`, { align: 'center' });
        doc.moveDown(2);

        // --- DATOS ---
        doc.font('Times-Bold').fontSize(12).text('DATOS DEL ESTUDIANTE:');
        doc.font('Times-Roman').fontSize(11);
        doc.text(`Nombre: ${student.first_name} ${student.last_name}`);
        doc.text(`Cédula/ID: ${student.dni || student.id_student}`); 
        doc.text(`Grado: ${section.Grade?.name_grade || 'N/A'}   Sección: "${section.num_section}"`);
        doc.moveDown(2);

        // --- TABLA ---
        const table = {
            title: "Resumen Académico",
            headers: ["Asignatura", "Promedio", "Estado"],
            rows: tableRows,
        };

        await doc.table(table, {
            width: 470,
            prepareHeader: () => doc.font("Times-Bold").fontSize(10),
            prepareRow: () => doc.font("Times-Roman").fontSize(10),
        });

        // --- PIE DE PÁGINA CON EL PROMEDIO CALCULADO ---
        doc.moveDown(2);
        doc.font('Times-Bold').text(`Promedio General Acumulado: ${calculatedGeneralAvg}`); // ¡AQUÍ ESTÁ LA CORRECCIÓN!
        doc.text(`Situación: ${enrollmentData.status}`);

        // Firmas
        doc.moveDown(4);
        const yPosition = doc.y;
        doc.moveTo(72, yPosition).lineTo(250, yPosition).stroke();
        doc.text("Director(a)", 72, yPosition + 5);
        doc.moveTo(300, yPosition).lineTo(500, yPosition).stroke();
        doc.text("Docente de Grado", 300, yPosition + 5);

        doc.end();

    } catch (error) {
        console.error("Error PDF:", error);
        if (!res.headersSent) res.status(500).send("Error generando el boletín");
    }
};