const Pension = require("../models/pension.js");
const createError = require('.././utils/error.js');
const successResponse = require('.././utils/successResponse.js')

// Define controller methods for handling User requests
exports.getAllPension = async (req, res) => {
  try {
    if (req.user.role === "superAdmin") {
      const pensions = await Pension.findAll({
        where: { userId: req.user.id, isActive: true },
      });
      res.status(200).json({
        total: pensions.length,
        pensions,
      });
    } else if (req.user.role === "companyAdmin") {
      const pensions = await Pension.findAll({
        where: { companyId: req.user.id },
      });
      res.status(200).json({
        count: pensions.length,
        pensions,
      });
    }
  } catch (error) {
    return next(createError.createError(500,"Internal server error"));
  }
};

exports.getpensionById = async (req, res) => {
  try {
    const { id } = req.params;
    const pension = await Pension.findByPk(id);
    res.json(pension);
  } catch (error) {
    return next(createError.createError(500,"Internal server error"));
  }
};

exports.createPension = async (req, res, next) => {
  try {
    const { employerContribution, employeeContribution } = req.body;

    console.log("user ID", req.user.id);

    if (req.user.role === "superAdmin") {
      const getAllPension = await Pension.findAll({
        where: { userId: req.user.id },
      });

      if (getAllPension.length != 0) {
        res.status(409).json("Pension is already defined update it ");
      } else {
        const pensions = await Pension.create({
          employerContribution,
          employeeContribution,
        });
        await pensions.setUser(Number(req.user.id));
        return res.status(200).json({
          message: "Successfully Registered",
          pensions,
        });
      }
    } else if (req.user.role === "companyAdmin") {
      const getAllPension = await Pension.findAll({
        where: { companyId: req.user.id },
      });
      if (getAllPension.length != 0) {
        return next(createError.createError(409,"Pension is already defined update it"));
        
      } else {
        const pensions = await Pension.create({
          employerContribution,
          employeeContribution,
        });
        await pensions.setCompany(Number(req.user.id));
        return res.status(200).json({
          message: "Successfully Registered",
          pensions,
        });
      }
    }
  } catch (error) {
    console.log("first", error);
    return next(createError.createError(500,"Internal server error"));
  }
};

exports.updatePension = async (req, res, next) => {
  try {
    const { employeeContribution, employerContribution } = req.body;
    const updates = {};
    const { id } = req.params;

    if (req.user.role === "superAdmin") {
      const checkPension = await Pension.findByPk(id);
      if (!checkPension) {
        return res
          .status(404)
          .json({ message: "There is no pension with these Id" });
      } else {
        if (employerContribution) {
          updates.employerContribution = employerContribution;
        }
        if (employeeContribution) {
          updates.employeeContribution = employeeContribution;
        }

        const result = await Pension.update(
          { isActive: false },
          { where: { id: id } }
        );
        const newPension = await Pension.create({
          employeeContribution,
          employerContribution,
        });
        await newPension.setUser(Number(req.user.id));

        return res.status(200).json({
          message: "updated successfully",
          newPension,
        });
      }
    } else if (req.user.role === "companyAdmin") {
      const checkPension = await Pension.findByPk(id);

      if (!checkPension) {
        return res
          .status(404)
          .json({ message: "There is no pension with these Id" });
      } else {
        if (employerContribution) {
          updates.employerContribution = employerContribution;
        }
        if (employeeContribution) {
          updates.employeeContribution = employeeContribution;
        }

        const result = await Pension.update(
          { isActive: false },
          { where: { id: id } }
        );
        const newPension = await Pension.create({
          employeeContribution,
          employerContribution,
        });
        await newPension.setCompany(Number(req.user.id));

        return res.status(200).json({
          message: "updated successfully",
          newPension,
        });
      }
    }
  } catch (error) {
    console.log("first", error);
    return next(createError.createError(500,"Internal server error"));
  }
};

exports.deletePension = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pension = await Pension.findOne({ where: { id: id } });
    if (pension) {
      await Pension.destroy({ where: { id } });
      return res.status(200).json(successResponse.createSuccess("Deleted successfully"));
    } else {
      return res
        .status(409)
        .json({ message: "There is no pension with this ID" });
    }
  } catch (error) {
    return next(createError.createError(500,"Internal server error"));
  }
};

//GET ALL INCLUDING IN ACTIVE PENSION

exports.getAllPensionIncludingInActive = async (req, res) => {
  try {
    if (req.user.role === "superAdmin") {
      const pensions = await Pension.findAll({
        where: { userId: req.user.id },
      });
      res.status(200).json({
        count: pensions.length,
        pensions,
      });
    } else if (req.user.role === "companyAdmin") {
      const pensions = await Pension.findAll({
        where: { companyId: req.user.id },
      });
      res.status(200).json({
        count: pensions.length,
        pensions,
      });
    }
  } catch (error) {
    return next(createError.createError(500,"Internal server error"));
  }
};
