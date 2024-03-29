const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const ServiceModel=require("../models/services.js")
const Package = sequelize.define("Package", {
  
  packageName: {
    type: DataTypes.ENUM("Custom", "Gold", "Platinium"),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Custom', 'Gold', 'Platinium']],
        msg: 'Invalid value for packageName. Must be one of: Custom, Gold, Platinium',
      },
    },
  },
  packageType:{
    type: DataTypes.ENUM("Yearly", "Monthly"),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Yearly', 'Monthly']],
        msg: 'Invalid value for packageType. Must be one of: Yearly, Monthly',
      },
    },
  },
  ///
  price: {
    type: DataTypes.DOUBLE,
  },
  min_employee: {
    type: DataTypes.INTEGER,
  },
  max_employee: {
    type: DataTypes.INTEGER,
  },
  // service: {
  //   type: DataTypes.JSON, // Use JSON type for storing JSON data
  //   defaultValue: [], // Default value as an empty array
  // },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isTrial: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Define a one-to-many association between PackageModel and ServiceModel
// Package.hasMany(ServiceModel, { as: 'services' });
Package.hasMany(ServiceModel);

module.exports = Package;
