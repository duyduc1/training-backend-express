const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    ProductName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    Price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    Description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: "products",
    timestamps: true,
});

module.exports = Product;