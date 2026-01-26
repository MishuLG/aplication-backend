// seed.js - Versión Final Corregida
import bcrypt from 'bcryptjs'; // Importamos bcrypt para hashear la contraseña real
import { 
    sequelize, Role, User, Grade, Subject, SchoolYear, Tutor 
} from './src/models/Sequelize/index.js'; 

async function seedDatabase() {
    try {
        console.log('🔄 Sincronizando Base de Datos...');
        
        // BORRA TODO y crea las tablas de cero
        await sequelize.sync({ force: true });
        console.log('✅ Base de datos creada desde cero.');

        // 1. ROLES
        await Role.bulkCreate([
            { id_rols: 1, name_rol: 'admin', description_rols: 'Director' },
            { id_rols: 2, name_rol: 'tutor', description_rols: 'Representante' },
            { id_rols: 3, name_rol: 'student', description_rols: 'Estudiante' }
        ]);
        console.log('✅ Roles creados.');

        // 2. GRADOS ACADÉMICOS
        const grades = await Grade.bulkCreate([
            { name_grade: '1er Grado' }, { name_grade: '2do Grado' },
            { name_grade: '3er Grado' }, { name_grade: '4to Grado' },
            { name_grade: '5to Grado' }, { name_grade: '6to Grado' }
        ]);
        
        // Lógica de promoción
        for (let i = 0; i < 5; i++) {
            grades[i].next_grade_id = grades[i+1].id_grade;
            await grades[i].save();
        }
        console.log('✅ Grados creados.');

        // 3. MATERIAS
        const subjects = await Subject.bulkCreate([
            { name_subject: 'Matemáticas', description_subject: 'Ciencias exactas' },
            { name_subject: 'Lenguaje', description_subject: 'Literatura' },
            { name_subject: 'Ciencias Naturales', description_subject: 'Biología' },
            { name_subject: 'Inglés', description_subject: 'Idioma' },
            { name_subject: 'Educación Física', description_subject: 'Deporte' },
            { name_subject: 'Educación Estética', description_subject: 'Arte' }
        ]);
        console.log('✅ Materias creadas.');

        // 4. PENSUM
        for (const grade of grades) {
            await grade.addSubjects(subjects);
        }
        console.log('✅ Pensum vinculado.');

        // 5. AÑO ESCOLAR
        await SchoolYear.create({
            name_period: '2025-2026',
            start_year: '2025-09-01',
            end_of_year: '2026-07-31',
            school_year_status: 'Activo'
        });
        console.log('✅ Año Escolar creado.');

        // 6. USUARIO ADMIN (Lendy) - AQUÍ ESTÁ LA SOLUCIÓN
        // Generamos el hash real de tu contraseña al momento
        const adminPasswordHash = await bcrypt.hash('16420953A', 10);

        const adminUser = await User.create({
            id_rols: 1,
            first_name: 'Lendy',
            last_name: 'Javier',
            dni: '16420953',
            email: 'lendyjavier04@hotmail.com',
            password: adminPasswordHash, // Usamos el hash generado
            status: 'active'
        });
        console.log('✅ Admin creado (Contraseña: 16420953A).');

        // 7. TUTOR DE PRUEBA
        const tutorPasswordHash = await bcrypt.hash('123456', 10);
        
        const tutorUser = await User.create({
            id_rols: 2,
            first_name: 'Representante',
            last_name: 'Prueba',
            dni: '00000000',
            email: 'tutor@escuela.com',
            password: tutorPasswordHash, 
            status: 'active'
        });
        
        await Tutor.create({
            uid_users: tutorUser.uid_users,
            profession: 'No especificada',
            work_place: 'No especificado'
        });
        console.log('✅ Tutor Genérico creado.');

        console.log('🚀 SISTEMA LISTO PARA USAR');
        process.exit();

    } catch (error) {
        console.error('❌ Error fatal:', error);
        process.exit(1);
    }
}

seedDatabase();