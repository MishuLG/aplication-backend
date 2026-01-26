import { ClassSchedule, Section, Subject, Grade, sequelize } from '../models/Sequelize/index.js';
import { Op } from 'sequelize';

// --- GENERADOR DE HORARIOS: BLOQUES INTEGRADOS (90 MIN) ---
export const generateAutoSchedule = async (req, res) => {
    const { id_section } = req.params;

    try {
        // 1. Obtener datos de la sección y materias
        const section = await Section.findByPk(id_section, {
            include: [{ 
                model: Grade, 
                include: [Subject] 
            }]
        });

        if (!section) return res.status(404).json({ message: 'Sección no encontrada' });

        let availableSubjects = section.Grade?.Subjects;
        if (!availableSubjects || availableSubjects.length === 0) {
            return res.status(400).json({ message: 'El grado no tiene materias asignadas.' });
        }

        // 2. Limpiar horario anterior de esta sección
        await ClassSchedule.destroy({ where: { id_section } });

        // 3. MAPA DE CALOR GLOBAL (Para evitar choques entre secciones)
        // Buscamos qué materias se están dando ya en el colegio
        const allActiveSchedules = await ClassSchedule.findAll({
            attributes: ['day_of_week', 'start_time', 'id_subject']
        });

        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

        // DEFINICIÓN DE "BLOQUES INTEGRADOS" (90 Minutos = 2 turnos de 45)
        // Esto agrupa las horas para que la clase sea continua.
        const academicBlocks = [
            { 
                id: 'A', 
                slots: [ { start: '07:00', end: '07:45' }, { start: '07:45', end: '08:30' } ]
            },
            // 08:30 - 09:00 RECREO (No se programa)
            { 
                id: 'B', 
                slots: [ { start: '09:00', end: '09:45' }, { start: '09:45', end: '10:30' } ]
            },
            { 
                id: 'C', 
                slots: [ { start: '10:30', end: '11:15' }, { start: '11:15', end: '12:00' } ]
            }
        ];

        // CONTROL DE FRECUENCIA SEMANAL
        // Matemáticas/Lenguaje pueden verse hasta 3 veces por semana (6 bloques), otras solo 1 o 2.
        let subjectWeeklyCounts = {}; // Cuántas sesiones dobles lleva
        availableSubjects.forEach(s => subjectWeeklyCounts[s.id_subject] = 0);

        const newSchedules = [];

        // --- ALGORITMO DE ASIGNACIÓN ---
        for (const day of days) {
            
            // Rastreador diario para no repetir la misma materia el mismo día
            const subjectsToday = new Set();

            for (const block of academicBlocks) {
                
                // 1. Identificar conflictos globales en este bloque (Hora de inicio del primer slot)
                // Si alguien más está dando esa materia a las 07:00, está ocupada.
                const busySubjectsGlobal = allActiveSchedules
                    .filter(s => s.day_of_week === day && s.start_time.substring(0,5) === block.slots[0].start)
                    .map(s => s.id_subject);

                // 2. Filtrar Candidatos
                let validCandidates = availableSubjects.filter(subj => {
                    const id = subj.id_subject;
                    const name = subj.name_subject.toLowerCase();
                    
                    // Regla A: No repetir el mismo día
                    if (subjectsToday.has(id)) return false;

                    // Regla B: Conflicto Global (Choque con otra sección)
                    if (busySubjectsGlobal.includes(id)) return false;

                    // Regla C: Límite Semanal (Matemáticas/Lenguaje tienen más peso)
                    const limit = (name.includes('matem') || name.includes('lengu')) ? 3 : 2; 
                    if (subjectWeeklyCounts[id] >= limit) return false;

                    return true;
                });

                // 3. ESTRATEGIAS DE RELAJACIÓN (Si no hay candidatos perfectos)
                
                // Intento 2: Ignorar Conflicto Global (Si todo el colegio está ocupado, ni modo)
                if (validCandidates.length === 0) {
                    validCandidates = availableSubjects.filter(subj => {
                        const id = subj.id_subject;
                        if (subjectsToday.has(id)) return false; // Esto sí se respeta siempre
                        
                        // Solo validamos límite semanal
                        const limit = 2; 
                        return subjectWeeklyCounts[id] < limit;
                    });
                }

                // Intento 3: Rellenar con cualquier cosa válida que no se haya visto hoy
                if (validCandidates.length === 0) {
                     validCandidates = availableSubjects.filter(subj => !subjectsToday.has(subj.id_subject));
                }

                // 4. Selección Aleatoria y Asignación
                if (validCandidates.length > 0) {
                    // Barajamos para dar variedad
                    const selected = validCandidates[Math.floor(Math.random() * validCandidates.length)];
                    
                    // Insertamos LOS DOS slots del bloque (Clase Doble)
                    block.slots.forEach(slot => {
                        newSchedules.push({
                            id_section,
                            id_subject: selected.id_subject,
                            day_of_week: day,
                            start_time: slot.start,
                            end_time: slot.end
                        });
                    });

                    // Actualizar contadores
                    subjectWeeklyCounts[selected.id_subject]++;
                    subjectsToday.add(selected.id_subject);
                }
            }
        }

        // 4. Guardar todo en la BD
        if (newSchedules.length > 0) {
            await ClassSchedule.bulkCreate(newSchedules);
        }

        res.json({ 
            message: 'Horario estructurado generado (Bloques de 90min)',
            details: {
                total_sessions: newSchedules.length / 2, // Cantidad de clases dobles
                logic: 'Bloques consecutivos, sin repetición diaria.'
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar horario', error: error.message });
    }
};

// --- OBTENER HORARIO (Ordenado Lunes-Viernes y por Hora) ---
export const getClassSchedulesBySection = async (req, res) => {
    const { id_section } = req.params;
    try {
        const schedules = await ClassSchedule.findAll({
            where: { id_section },
            include: [{ model: Subject, attributes: ['name_subject'] }],
            order: [
                [sequelize.literal(`CASE 
                    WHEN day_of_week = 'Lunes' THEN 1 
                    WHEN day_of_week = 'Martes' THEN 2 
                    WHEN day_of_week = 'Miércoles' THEN 3 
                    WHEN day_of_week = 'Jueves' THEN 4 
                    WHEN day_of_week = 'Viernes' THEN 5 
                    ELSE 6 END`), 'ASC'],
                ['start_time', 'ASC']
            ]
        });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener horarios' });
    }
};

export const createClassSchedule = async (req, res) => {
    try {
        const newItem = await ClassSchedule.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear bloque' });
    }
};

export const deleteClassSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        await ClassSchedule.destroy({ where: { id_class_schedules: id } });
        res.json({ message: 'Bloque eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};