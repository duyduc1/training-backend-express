const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: "products",
    timestamps: true,
});

module.exports = Product;