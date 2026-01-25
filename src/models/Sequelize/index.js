import sequelize from "../../database/sequelize.js";

// --- IMPORTAR MODELOS ---
import Student from "./students.model.js";
import Subject from "./subjects.model.js";
import ClassSchedule from "./classSchedules.model.js";
import Evaluation from "./evaluations.model.js";
import Grade from "./grades.model.js";
import SchoolYear from "./schoolYears.model.js";
import Section from "./sections.model.js";
import Enrollment from "./enrollments.model.js";
import AcademicRecord from "./academicRecords.model.js";
import Tutor from "./tutors.model.js";

// --- DEFINIR ASOCIACIONES (RELACIONES) ---

// 1. Jerarquía Escolar
Grade.hasMany(Section, { foreignKey: 'id_grade' });
Section.belongsTo(Grade, { foreignKey: 'id_grade' });

SchoolYear.hasMany(Section, { foreignKey: 'id_school_year' });
Section.belongsTo(SchoolYear, { foreignKey: 'id_school_year' });

// 2. El Pensum (Grados <-> Materias)
Grade.belongsToMany(Subject, { through: 'curriculum', foreignKey: 'id_grade', otherKey: 'id_subject' });
Subject.belongsToMany(Grade, { through: 'curriculum', foreignKey: 'id_subject', otherKey: 'id_grade' });

// 3. Inscripciones y Estudiantes
Student.hasMany(Enrollment, { foreignKey: 'id_student' });
Enrollment.belongsTo(Student, { foreignKey: 'id_student' });

Section.hasMany(Enrollment, { foreignKey: 'id_section' });
Enrollment.belongsTo(Section, { foreignKey: 'id_section' });

// Relaciones Directas Estudiante (Perfil)
Section.hasMany(Student, { foreignKey: 'id_section' });
Student.belongsTo(Section, { foreignKey: 'id_section' });

SchoolYear.hasMany(Student, { foreignKey: 'id_school_year' });
Student.belongsTo(SchoolYear, { foreignKey: 'id_school_year' });

// Relación Tutor-Estudiante
Tutor.hasMany(Student, { foreignKey: 'id_tutor' });
Student.belongsTo(Tutor, { foreignKey: 'id_tutor' });

// 4. Notas Académicas
Enrollment.hasMany(AcademicRecord, { foreignKey: 'id_enrollment' });
AcademicRecord.belongsTo(Enrollment, { foreignKey: 'id_enrollment' });

AcademicRecord.belongsTo(Subject, { foreignKey: 'id_subject' });
Subject.hasMany(AcademicRecord, { foreignKey: 'id_subject' });

// 5. Evaluaciones
Evaluation.belongsTo(Student, { foreignKey: "id_student" });
Evaluation.belongsTo(Subject, { foreignKey: "id_subject" });

// --- 6. HORARIOS DE CLASES (AQUÍ ESTABA EL ERROR) ---
// Faltaban estas líneas para conectar Horario con Sección y Materia
Section.hasMany(ClassSchedule, { foreignKey: 'id_section' });
ClassSchedule.belongsTo(Section, { foreignKey: 'id_section' });

Subject.hasMany(ClassSchedule, { foreignKey: 'id_subject' });
ClassSchedule.belongsTo(Subject, { foreignKey: 'id_subject' });
// -----------------------------------------------------

// --- SINCRONIZACIÓN Y EXPORTACIÓN ---
sequelize.sync({ alter: true }) 
  .then(() => console.log("✅ Modelos Sequelize sincronizados correctamente"))
  .catch((error) => console.error("❌ Error sincronizando modelos:", error));

export { 
    sequelize, 
    Student, 
    Subject, 
    ClassSchedule, 
    Evaluation,
    Grade,
    SchoolYear,
    Section,
    Enrollment,
    AcademicRecord,
    Tutor 
};