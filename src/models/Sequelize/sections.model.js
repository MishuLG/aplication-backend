import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";
import Grade from "./grades.model.js";
import SchoolYear from "./schoolYears.model.js";

const Section = sequelize.define("Section", {
  id_section: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  num_section: { // Ej: "A", "B"
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  }
  // Las FK se definen en el index.js, pero Sequelize necesita los campos aquí si no usas asociaciones automáticas puras.
  // Por buenas prácticas, dejaremos que las asociaciones en index.js manejen las llaves foráneas.
}, {
  tableName: "section",
  timestamps: true,
  underscored: true,
});

export default Section;