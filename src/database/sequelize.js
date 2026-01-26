import { Sequelize } from "sequelize";
import { DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT, DB_USER } from "../../config.js";

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  port: DB_PORT,
  logging: false, // Ponlo en console.log si quieres ver los SQL
  define: {
    timestamps: true,     // Crea created_at y updated_at automáticamente
    underscored: true,    // ¡CLAVE! Convierte camelCase a snake_case (createdAt -> created_at)
    freezeTableName: true // Evita que pluralice nombres raros automáticamente
  },
});

export default sequelize;