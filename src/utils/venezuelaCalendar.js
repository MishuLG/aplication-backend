// src/utils/venezuelaCalendar.js

export const calculateSchoolDays = (startDateStr, endDateStr) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    
    let totalSchoolDays = 0;
    let holidaysFound = [];
    let vacationDays = 0;

    // FERIADOS FIJOS VENEZUELA Y TÁCHIRA
    const fixedHolidays = {
        '0-1': 'Año Nuevo',
        '0-20': 'Feria de San Sebastián (Táchira)', // Regional
        '3-19': 'Declaración de la Independencia',
        '4-1': 'Día del Trabajador',
        '5-24': 'Batalla de Carabobo',
        '6-5': 'Día de la Independencia',
        '6-24': 'Natalicio del Libertador',
        '9-12': 'Día de la Resistencia Indígena',
        '11-24': 'Víspera de Navidad',
        '11-25': 'Navidad',
        '11-31': 'Fin de Año'
    };

    // Recorremos día por día
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const month = d.getMonth(); // 0-11
        const date = d.getDate();   // 1-31
        const dayOfWeek = d.getDay(); // 0 (Dom) - 6 (Sab)
        const key = `${month}-${date}`;

        // 1. Detectar Vacaciones de Navidad (Aprox 16 Dic - 7 Ene)
        if ((month === 11 && date >= 16) || (month === 0 && date <= 7)) {
            if (dayOfWeek !== 0 && dayOfWeek !== 6) vacationDays++; // Solo contamos días hábiles de vacaciones
            continue; // Saltamos, no es día escolar
        }

        // 2. Detectar Vacaciones de Agosto (Si el año escolar se extiende)
        if (month === 7) { // Agosto
             if (dayOfWeek !== 0 && dayOfWeek !== 6) vacationDays++;
             continue;
        }

        // 3. Ignorar Fines de Semana
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        // 4. Detectar Feriados
        if (fixedHolidays[key]) {
            // Solo lo agregamos a la lista si cae entre semana
            holidaysFound.push(`${fixedHolidays[key]} (${date}/${month + 1})`);
            continue; // Es feriado, no hay clase
        }

        // Si pasó todos los filtros, es día de clase
        totalSchoolDays++;
    }

    // Formatear resumen de eventos
    const specialEventsStr = holidaysFound.length > 0 
        ? `Feriados: ${holidaysFound.join(', ')}` 
        : 'Sin eventos especiales registrados';

    return {
        schoolDays: totalSchoolDays,
        vacationDays: vacationDays,
        specialEvents: specialEventsStr.substring(0, 250) // Cortamos para no exceder límite de BD si es corto
    };
};