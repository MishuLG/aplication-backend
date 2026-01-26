import sequelize from "../../database/sequelize.js";

// --- IMPORTAR TODOS LOS MODELOS ---
import Role from "./roles.model.js";
import User from "./users.model.js";
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
import Newsletter from "./newsletters.model.js";
import Attendance from "./attendances.model.js";

// --- ASOCIACIONES (RELACIONES) ---

// 1. Usuarios y Roles
Role.hasMany(User, { foreignKey: 'id_rols' });
User.belongsTo(Role, { foreignKey: 'id_rols' });

// 2. Jerarquía Escolar
Grade.hasMany(Section, { foreignKey: 'id_grade' });
Section.belongsTo(Grade, { foreignKey: 'id_grade' });

SchoolYear.hasMany(Section, { foreignKey: 'id_school_year' });
Section.belongsTo(SchoolYear, { foreignKey: 'id_school_year' });

// 3. Pensum (Grados <-> Materias)
Grade.belongsToMany(Subject, { through: 'curriculum', foreignKey: 'id_grade', otherKey: 'id_subject' });
Subject.belongsToMany(Grade, { through: 'curriculum', foreignKey: 'id_subject', otherKey: 'id_grade' });

// 4. Tutores y Estudiantes
// Un User puede ser Tutor
User.hasOne(Tutor, { foreignKey: 'uid_users' });
Tutor.belongsTo(User, { foreignKey: 'uid_users' });

Tutor.hasMany(Student, { foreignKey: 'id_tutor' });
Student.belongsTo(Tutor, { foreignKey: 'id_tutor' });

// 5. Estudiantes y Secciones
Section.hasMany(Student, { foreignKey: 'id_section' });
Student.belongsTo(Section, { foreignKey: 'id_section' });

SchoolYear.hasMany(Student, { foreignKey: 'id_school_year' });
Student.belongsTo(SchoolYear, { foreignKey: 'id_school_year' });

// 6. Horarios
Section.hasMany(ClassSchedule, { foreignKey: 'id_section' });
ClassSchedule.belongsTo(Section, { foreignKey: 'id_section' });

Subject.hasMany(ClassSchedule, { foreignKey: 'id_subject' });
ClassSchedule.belongsTo(Subject, { foreignKey: 'id_subject' });

// 7. Asistencias (Vinculadas al estudiante y al horario de la clase)
Student.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(Student, { foreignKey: 'student_id' });

ClassSchedule.hasMany(Attendance, { foreignKey: 'class_schedule_id' });
Attendance.belongsTo(ClassSchedule, { foreignKey: 'class_schedule_id' });

// 8. Evaluaciones y Notas
Evaluation.belongsTo(Student, { foreignKey: "id_student" });
Evaluation.belongsTo(Subject, { foreignKey: "id_subject" });

Enrollment.belongsTo(Student, { foreignKey: 'id_student' });
Enrollment.belongsTo(Section, { foreignKey: 'id_section' });

AcademicRecord.belongsTo(Enrollment, { foreignKey: 'id_enrollment' });
AcademicRecord.belongsTo(Subject, { foreignKey: 'id_subject' });

// 9. Noticias (Autor)
User.hasMany(Newsletter, { foreignKey: 'uid_users' });
Newsletter.belongsTo(User, { foreignKey: 'uid_users' });

// --- EXPORTAR TODO ---
export { 
    sequelize, 
    Role, User, Tutor, Student, 
    Grade, Section, Subject, SchoolYear,
    ClassSchedule, Attendance, 
    Evaluation, Enrollment, AcademicRecord, Newsletter 
};