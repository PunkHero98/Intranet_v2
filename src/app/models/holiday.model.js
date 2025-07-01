import sequelize from "../../config/db/sequelize.js";
import { DataTypes } from "sequelize";

const Holiday = sequelize.define("holiday", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    countryName: { type: DataTypes.STRING, allowNull: false },
    data: { type: DataTypes.JSON, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    createdBy: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: "holidays",
    timestamps: false,
    freezeTableName: true
});

const insertDataHoliday = async (countryName, data, date, createdBy) => {
    const result = await Holiday.create({
        countryName,
        data: JSON.stringify(data), // Ensure data is stored as JSON string
        date,
        createdBy
    });
    return result; 
};

export { Holiday, insertDataHoliday };
