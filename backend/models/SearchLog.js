import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";

const SearchLog = sequelize.define('SearchLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  search_query: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  device_info: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'search_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default SearchLog;
