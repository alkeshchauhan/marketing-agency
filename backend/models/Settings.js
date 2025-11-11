import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Settings = sequelize.define("Settings", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    group: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: "settings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

export default Settings;