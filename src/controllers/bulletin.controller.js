import PDFDocument from "pdfkit-table"; // Usamos la versión con tablas
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { Enrollment, Student, Section, Grade, SchoolYear, AcademicRecord, Subject } from "../models/Sequelize/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateBulletinPDF = async (req, res) => {
    try {
        const { id_enrollment } = req.params;

        // 1. Buscar toda la información del estudiante y sus notas
        const enrollmentData = await Enrollment.findOne({
            where: { id_enrollment },
            include: [
                { model: Student },
                { 
                    model: Section, 
                    include: [Grade, SchoolYear] 
                },
                {
                    model: AcademicRecord,
                    include: [Subject] // Traer nombres de materias
                }
            ]
        });

        if (!enrollmentData) {
            return res.status(404).json({ message: "Inscripción no encontrada" });
        }

        const student = enrollmentData.Student;
        const section = enrollmentData.Section;
        const records = enrollmentData.AcademicRecords;

        // 2. Configurar el Documento PDF (Normas APA: Márgenes 2.54cm = ~72 puntos)
        const doc = new PDFDocument({
            margin: 72, // 1 pulgada (2.54cm)
            size: 'LETTER'
        });

        // Configurar headers para que el navegador descargue el PDF
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=Boletin_${student.last_name_student}_${section.SchoolYear.name_period}.pdf`);

        doc.pipe(res); // Enviar directo al cliente

        // --- ENCABEZADO CON LOGO ---
        // Intenta cargar el logo, si falla sigue sin logo
        const logoPath = path.join(__dirname, '../assets/logo.png'); 
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 72, 50, { width: 60 });
        }

        doc.moveDown(1);
        doc.font('Times-Roman').fontSize(14).text('UNIDAD EDUCATIVA "Francis de Miranda"', { align: 'center', bold: true });
        doc.fontSize(12).text('Informe de Rendimiento Académico', { align: 'center' });
        doc.text(`Año Escolar: ${section.SchoolYear.name_period}`, { align: 'center' });
        doc.moveDown(2);

        // --- DATOS DEL ESTUDIANTE (Cuadro informativo) ---
        doc.font('Times-Bold').fontSize(12).text('DATOS DEL ESTUDIANTE:');
        doc.font('Times-Roman').fontSize(11);
        
        // Dibujamos datos
        doc.text(`Nombre: ${student.first_name_student} ${student.last_name_student}`);
        doc.text(`Cédula/ID: ${student.id_student}`); // Ajusta si tienes campo cedula
        doc.text(`Grado: ${section.Grade.name_grade}   Sección: "${section.num_section}"`);
        doc.moveDown(2);

        // --- TABLA DE NOTAS (Automática) ---
        // Preparamos los datos para la tabla
        const tableData = records.map(record => {
            return [
                record.Subject.name_subject, // Materia
                record.final_grade.toString(), // Nota (Definitiva)
                record.status_subject // Estado
            ];
        });

        const table = {
            title: "Resumen Académico",
            headers: ["Asignatura", "Nota Definitiva", "Estado"],
            rows: tableData,
        };

        // Estilos de la tabla (Simple y limpia, estilo académico)
        await doc.table(table, {
            width: 470, // Ancho disponible
            prepareHeader: () => doc.font("Times-Bold").fontSize(10),
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font("Times-Roman").fontSize(10);
                // Ejemplo: Poner en rojo si reprobó (Opcional)
                // if (indexColumn === 1 && parseFloat(row[1]) < 10) { doc.fillColor('red'); }
            },
        });

        // --- PIE DE PÁGINA / RESULTADO FINAL ---
        doc.moveDown(2);
        doc.font('Times-Bold').text(`Promedio General: ${enrollmentData.final_average}`);
        doc.text(`Situación Final: ${enrollmentData.status.toUpperCase()}`);

        // Firmas (Cuadros automáticos al final)
        doc.moveDown(4);
        const yPosition = doc.y;
        
        // Línea Director
        doc.moveTo(72, yPosition).lineTo(250, yPosition).stroke();
        doc.text("Director(a)", 72, yPosition + 5);

        // Línea Docente
        doc.moveTo(300, yPosition).lineTo(500, yPosition).stroke();
        doc.text("Docente de Grado", 300, yPosition + 5);

        // --- FINALIZAR ---
        doc.end();

    } catch (error) {
        console.error("Error generando PDF:", error);
        res.status(500).send("Error generando el boletín");
    }
};