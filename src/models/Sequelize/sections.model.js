import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

// --- YA NO IMPORTAMOS Grade NI SchoolYear AQUÍ ---

const Section = sequelize.define("Section", {
  id_section: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  num_section: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  }
}, {
  tableName: "section",
  timestamps: true,
  underscored: true,
});

export default Section;