const Department = require('../models/department.js')
const createError = require('../utils/error.js')

// Define controller methods for handling User requests
exports.getAllDepartment = async (req, res, next) => {
  try {
    const departments = await Department.findAll({
      where: { companyId: req.user.id }
    })
    if (!departments) {
      return next(createError.createError(404, 'Department not found'))
    } else {
      return res.status(200).json({
      success:true,
      message:"Data found",
        data:departments
      })
    }
  } catch (error) {
    console.log(error)
    return next(createError.createError(500, 'Internal Server Error'))
  }
}


exports.getDepartmentById = async (req, res,next) => {
  try {
    const { id } = req.params
    const department = await Department.findOne({
      where: { id:id,companyId: req.user.id }
    })
    if (!department) {
          return next(createError.createError(404,"Department not found"));
    
    } else {
      return res.json({ 
        success:true,
        message:"Data found",
        data: department })
    }
  } catch (error) {
  console.log(error);
  return next(createError.createError(500,"Internal Server Error"));
  }
}

exports.createDepartment = async (req, res, next) => {
  try {
    const { deptName, location, shorthandRepresentation } = req.body

    const criteria = {
      companyId: req.user.id,
      deptName: deptName
    }

    const checkDepartment = await Department.findOne({ where: criteria })

    if (checkDepartment) {
      return next(createError.createError(409, 'Department defined already'))
    } else {
      const departments = await Department.create({
        deptName,
        location,
        shorthandRepresentation
      })
      await departments.setCompany(req.user.id)
      return res.status(200).json({
        success: true,
        message: 'Successfully Registered',
        data: departments
      })
    }
  } catch (error) {
    console.log(error)
    return next(createError.createError(500, 'Internal Server Error'))
  }
}

exports.updateDepartment = async (req, res, next) => {
  try {
    const { deptName, location, shorthandRepresentation } = req.body
    const updates = {}
    const { id } = req.params
    const updatedEmployeeData = req.body

    if (deptName) {
      updates.deptName = deptName
    }
    if (location) {
      updates.location = location
    }
    if (shorthandRepresentation) {
      updates.shorthandRepresentation = shorthandRepresentation
    }
    const department = await Department.findOne({where: {id: id,companyId:req.user.id}})
    if (!department) {
      return next(createError.createError(404,"Department not found"));
    
    } else {
    

      if(department?.deptName ===deptName){
        return next(createError.createError(409,"Department name already exists"));
      }
      const result = await Department.update(updates, { where: { id: id } });
      return res.status(200).json({
        success: true,
        message: 'updated successfully'
       
      })
    }
  } catch (error) {
    console.log('error', error)
    return next(createError.createError(500,"Internal server error"));
  }
}

exports.deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params

    const department = await Department.findOne({ where: { id: id ,companyId:req.user.id} })
    if (department) {
      await Department.destroy({ where: { id } })
      return res
        .status(200)
        .json({ 
          success: true,
          message: 'Department deleted successfully',
        data:department })
    } else {
      return next(createError.createError(404,"Department not found"));
    
    }
  } catch (error) {
   console.log(error)
   return next(createError.createError(500,"Internal server error"));
  }
}
