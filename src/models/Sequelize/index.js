import sequelize from "../../database/sequelize.js";
import Student from "./students.model.js";
import Subject from "./subjects.model.js";
import ClassSchedule from "./classSchedules.model.js";
import Evaluation from "./evaluations.model.js";


Evaluation.belongsTo(Student, { foreignKey: "id_student" });
Evaluation.belongsTo(Subject, { foreignKey: "id_subject" });
Evaluation.belongsTo(ClassSchedule, { foreignKey: "id_class_schedules" });


sequelize.sync()
  .then(() => console.log("Sequelize models synchronized"))
  .catch((error) => console.error("Error syncing Sequelize models:", error));

export { sequelize, Student, Subject, ClassSchedule, Evaluation };
