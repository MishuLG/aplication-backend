import { DataTypes } from "sequelize";
import sequelize from "../../database/sequelize.js";

const Newsletter = sequelize.define("Newsletter", {
  id_newsletters: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT },
  date_sent: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  newsletter_status: { type: DataTypes.STRING, defaultValue: 'active' },
  recipients: { type: DataTypes.STRING, defaultValue: 'all' }
}, {
  tableName: "newsletters"
});

export default Newsletter;