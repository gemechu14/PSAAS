const { DataTypes } = require("sequelize");
const Package = require("./package.js");
const sequelize = require("../database/db.js");

const Services = sequelize.define("Services", {
    serviceName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Package.hasMany("Services")
module.exports = Services;
