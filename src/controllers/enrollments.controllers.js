import fs from 'fs';

const readData = () => {
    const data = fs.readFileSync('./src/db.json', 'utf-8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync('./src/db.json', JSON.stringify(data, null, 2));
};

export const getAllEnrollments = (req, res) => {
    const enrollments = readData().enrollments;
    res.json(enrollments);
};

export const getEnrollmentById = (req, res) => {
    const { id } = req.params;
    const enrollments = readData().enrollments;
    const enrollment = enrollments.find(e => e.id_enrollments === parseInt(id));

    if (enrollment) {
        res.json(enrollment);
    } else {
        res.status(404).send('Enrollment not found');
    }
};

export const createEnrollment = (req, res) => {
    const newEnrollment = req.body;
    const data = readData();
    
    newEnrollment.id_enrollments = data.enrollments.length ? Math.max(...data.enrollments.map(e => e.id_enrollments)) + 1 : 1;
    
    if (!data.students.some(student => student.id_student === newEnrollment.id_student)) {
        return res.status(400).send('Invalid student ID');
    }

    data.enrollments.push(newEnrollment);
    
    writeData(data);
    res.status(201).json(newEnrollment);
};

export const deleteEnrollmentById = (req, res) => {
    const { id } = req.params;
    let data = readData();
    
    const initialLength = data.enrollments.length;
    
    data.enrollments = data.enrollments.filter(e => e.id_enrollments !== parseInt(id));
    
    if (data.enrollments.length < initialLength) {
        writeData(data);
        res.send('Enrollment deleted');
    } else {
        res.status(404).send('Enrollment not found');
    }
};

export const updateEnrollmentById = (req, res) => {
    const { id } = req.params;
    const updatedEnrollment = req.body;

    let data = readData();
    
    const enrollmentIndex = data.enrollments.findIndex(e => e.id_enrollments === parseInt(id));

    if (enrollmentIndex !== -1) {
        updatedEnrollment.id_enrollments = parseInt(id); 
        data.enrollments[enrollmentIndex] = updatedEnrollment;

        writeData(data);
        res.json(updatedEnrollment);
    } else {
        res.status(404).send('Enrollment not found');
    }
};