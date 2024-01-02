const User = require("../models/user.js");
const Company = require("../models/company.js");
const sendEmail=require("../utils/email.js");
const createError = require('.././utils/error.js');
const successResponse = require('.././utils/successResponse.js')

// create User
exports.createUser = async (req, res, next) => {
  const body = req.body;

  try {
    const existingUser = await User.findOne({ where: { email: body.email } });
    if (existingUser) {
      return next(createError.createError(409, "User with this email is already registered."));

    } else {
      const user = await User.create({ ...body });
      return res.status(200).json({
        status: 'true',
        message: "User successfully registered.",
        data: {
          
            id: user.id,
            fullName: user.fullName,
            email: user.email,
                  },
      });
    }
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal Server Error."));
  }
};

// get AllUser
exports.getAllUser = async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
  });
  delete users.createdAt;
  delete users.updatedAt;
  return res.status(200).json(
    {
      success: true,
      message: "Data Found",
      data: users

    }
  );
};

// get only one user
exports.getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(Number(id), {
      attributes: { exclude: ["password"] },
    });
    if (!user) return next(createError.createError(404, "User does not exist"));

    return res.status(200).json({
      success: true,
      message: "Data Found",
      data:user

    });
  }
  catch (error) {
    return next(createError.createError(500, "Internal server error"));
  }
};

// update User
exports.updateUser = async (req, res, next) => {

  const { id } = req.params;
  const body = req.body;

  try {
    const user = await User.findByPk(Number(id));
    if (!user) return next(createError.createError(404, "User does not exist"));

    if (body.password) {
      delete body.password;
    }

    await user.validate();
    await user.update({ ...body });
    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data:user

    });
  } catch (error) {
    return next(createError.createError(500, "Internal server error"));
  }
};

// delete User
exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(Number(id));
    if (!user) return next(createError.createError(404, "User does not exist"));
    await user.destroy();
    return res.status(200).json(successResponse.createSuccess("User deleted successfully"));
    
  } catch (error) {
    return next(createError.createError(500, "Internal server error"));

  }
};

// exports.updateCompanyStatus = async (req, res, next) => {
//   const { id, status } = req.body;
//   try {
//     const company = await Company.findByPk(Number(id), {
//       attributes: { exclude: ["password"] },
//     });
//     const text = 'We are pleased to inform you that your status has been approved. Please enjoy'
//     if (!company)
//       return next(createError.createError(404, "company does not exist"));
//     await company.update({ status });


//     try {
//       await sendEmail({
//         email: "geme11.bulti@gmail.com",
//         subject: "THANK YOU FOR GOING WITH US.",
//         text
//       });
//       res.status(200).json({
//         status: 'success',
//         message: 'Message  sent to email',
//       });
//     } catch (err) {

//       return res.status(404).json({
//         message: 'There was an error sending the email. Try again later!',
//       });
//     }

//     console.log(company)
//     return res
//       .status(200)      
//       .json( successResponse.createSuccess("Company status Activated successfully"));
//   } catch (error) {
//     return next(createError.createError(500, "Internal server error"));
//   }
// };

exports.updateCompanyStatus = async (req, res, next) => {
  const { id, status } = req.body;

  try {
    const company = await Company.findByPk(Number(id), {
      attributes: { exclude: ["password"] },
    });

    if (!company) {
      return next(createError.createError(404, "Company does not exist"));
    }
// const newPassword = company.companyCode
    console.log(company.companyCode)
  const password =company.companyCode+'000'; // Replace this with the actual password
  const text = `We are pleased to inform you that your status has been approved. Please enjoy. Your temporary password is: ${password}`;
  const subject= `Thank you for your going with us`
  console.log("email",company.email)
    const emailSent = await sendActivationEmail(company.email, subject,text,next);

    if (emailSent) {
      await company.update({ status,password: password});
      return res.status(200).json({
        status: "success",
        message: "Company status activated successfully. Email sent.",
      });
    } else {
     return next(createError.createError(500, "Error sending activation email. Company status not updated"));
    
    }
  } catch (error) {
    console.error("Error updating company status:", error);
    return next(createError.createError(500, "Internal server error"));
  }
};

const sendActivationEmail = async (email, subject,text,next) => {
  try {
    await sendEmail({
      email,
      subject: subject,
      text,
    });
    return true;
  } catch (err) {
    console.error("Error sending email:");
    return false;
    // return next(createError.createError(500, "Error sending activation email. Company status not updated"));
  }
};
