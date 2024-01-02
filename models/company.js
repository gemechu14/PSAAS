const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");
const bcrypt = require("bcrypt");


const Company = sequelize.define("Company", {
  organizationName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Organization name must be unique.',
    },
  },
  companyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Company code must be unique.',
    },
  },
  
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Phone number must be unique.',
    },
  },
  numberOfEmployees: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  regionOrCity: {
    type: DataTypes.STRING,
  },
 
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  fax: {
    type: DataTypes.STRING,
  },
  streetAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountNumber: {
    type: DataTypes.STRING,
    // unique: {
    //   msg: 'account number must be unique.',
    // },
  },
    status: {
    type: DataTypes.ENUM,
    values: ["pending", "active", "blocked", "denied"],
    defaultValue: "pending",
  },
    
 
  password: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: "#FFF",
  },
  companyLogo: {
    type: DataTypes.STRING,
  },

  role: {
    type: DataTypes.STRING,
    defaultValue: "companyAdmin",
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  country: {
    type: DataTypes.STRING,
    defaultValue: "Ethiopia",
  },
  header: {
    type: DataTypes.STRING,
  },
  footer: {
    type: DataTypes.STRING,
  },
  //NEW CHANGE
  companyBanner: {
    type: DataTypes.STRING,
  },
  primaryColor: {
    type: DataTypes.STRING,
  },
  primaryFontColor: {
    type: DataTypes.STRING,
  },
  primaryGradientColor: {
    type: DataTypes.STRING,
  },
  secondaryColor: {
    type: DataTypes.STRING,
  },
  secondaryFontColor: {
    type: DataTypes.STRING,
  },
  socialMediaImages: {
    type: DataTypes.BOOLEAN,

    defaultValue: false,
  },
 
 
  notes: {
    type: DataTypes.STRING,
  },
});
Company.beforeCreate(async (company, options) => {
  if (company.password) {
    const saltRounds = 10;
    try {
      const hash = await bcrypt.hash(company.password, saltRounds);
      company.password = hash;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }
});


// Company.beforeCreate((company, options) => {
//   const saltRounds = 10;
//   return bcrypt
//     .hash(company?.password, saltRounds)
//     .then((hash) => {
//       company.password = hash;
//     })
//     .catch((err) => {
//       console.error(err);
//       throw new Error(err);
//     });
// });

Company.beforeUpdate((company, options) => {
  if (company.changed("password")) {
    const saltRounds = 10;
    return bcrypt
      .hash(company?.password, saltRounds)
      .then((hash) => {
        company.password = hash;
      })
      .catch((err) => {
        console.error(err);
        throw new Error(err);
      });
  }
});

module.exports = Company;
