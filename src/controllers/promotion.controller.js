import { sequelize, SchoolYear, Section, Enrollment, Grade } from "../models/Sequelize/index.js";
import { calculateSchoolDays } from "../utils/venezuelaCalendar.js"; // <--- IMPORTANTE

export const executePromotion = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { name_period, start_year, end_of_year } = req.body;

    // 1. CÁLCULO AUTOMÁTICO DE DÍAS Y EVENTOS (VENEZUELA)
    const calendarData = calculateSchoolDays(start_year, end_of_year);

    // 2. Identificar el Año Escolar Actual (El que vamos a cerrar)
    const currentYear = await SchoolYear.findOne({ 
      where: { school_year_status: 'Activo' } 
    });

    // 3. Crear el Nuevo Año Escolar con DATOS CALCULADOS
    const newSchoolYear = await SchoolYear.create({
      name_period,
      start_year,
      end_of_year,
      school_year_status: 'Planificación',
      // Aquí insertamos la magia automática:
      number_of_school_days: calendarData.schoolDays,
      scheduled_vacation: `Aprox. ${calendarData.vacationDays} días hábiles (Navidad/Agosto)`,
      special_events: calendarData.specialEvents
    }, { transaction });

    // 4. Estructura Base: Crear Secciones
    const allGrades = await Grade.findAll();
    const newSectionsMap = {}; 

    for (const grade of allGrades) {
      const newSection = await Section.create({
        num_section: "A",
        id_grade: grade.id_grade,
        id_school_year: newSchoolYear.id_school_year,
        capacity: 30
      }, { transaction });
      newSectionsMap[grade.id_grade] = newSection.id_section;
    }

    // 5. MIGRACIÓN DE ESTUDIANTES
    let stats = { promoted: 0, retained: 0, graduated: 0 };

    if (currentYear) {
      const oldEnrollments = await Enrollment.findAll({
        include: [
          { 
            model: Section, 
            where: { id_school_year: currentYear.id_school_year },
            include: [Grade] 
          }
        ]
      });

      for (const enrollment of oldEnrollments) {
        let targetGradeId = null;

        if (enrollment.status === 'Aprobado') {
          targetGradeId = enrollment.Section.Grade.next_grade_id;
          if (!targetGradeId) { stats.graduated++; continue; }
          stats.promoted++;
        } else if (enrollment.status === 'Reprobado') {
          targetGradeId = enrollment.Section.Grade.id_grade;
          stats.retained++;
        } else {
            continue;
        }

        if (targetGradeId && newSectionsMap[targetGradeId]) {
            await Enrollment.create({
                id_student: enrollment.id_student,
                id_section: newSectionsMap[targetGradeId],
                status: 'Pre-Inscrito', 
                observations: `Promoción Automática`
            }, { transaction });
        }
      }

      await currentYear.update({ school_year_status: 'Cerrado' }, { transaction });
    }

    await transaction.commit();

    // RESPUESTA AL CLIENTE
    res.status(200).json({
      message: "Proceso de cambio de año exitoso.",
      details: {
        // Corrección para que muestre el nombre del anterior (si existe)
        previousYear: currentYear ? (currentYear.name_period || "Año Anterior") : "Ninguno",
        newYear: newSchoolYear.name_period,
        stats: stats,
        // Información extra para que veas que sí calculó
        calculatedDays: calendarData.schoolDays 
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error("Error en promoción:", error);
    res.status(500).json({ message: "Error al procesar la promoción", error: error.message });
  }
};