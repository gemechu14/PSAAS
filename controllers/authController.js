const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Company = require('../models/company')
const User = require('../models/user')
const Employee = require('../models/employee')
const CustomRole = require('../models/customRole')
const Permission = require('../models/permission')
const cookieParser = require('cookie-parser')
const createError = require('.././utils/error.js')
const successResponse = require('.././utils/successResponse.js')

const signToken = (id, role) => {
  try {
    const accessToken = jwt.sign({ id, role }, 'secret', {
      expiresIn: '90d'
    })

    const refreshToken = jwt.sign({ id, role }, 'refreshSecret', {
      expiresIn: '7d' // Set your desired expiration time for refresh tokens
    })

    return { accessToken, refreshToken }
    // return jwt.sign({ id, role }, 'secret', {
    //   expiresIn: '90d'
    // })
  } catch (err) {
    // res.json(err);
    return err
  }
}

const createSendToken = async (company, statusCode, res, next) => {
  try {
    // const token = signToken(company.id, company.role)
    const { accessToken, refreshToken } = signToken(company.id, company.role)

    const cookieOptions = {
      expires: new Date(Date.now() + 1000 * 24 * 60 * 60 * 1000),

      secure: 'production' ? true : false,
      httpOnly: true
    }
    company.password = undefined
    res.cookie('jwt', accessToken, cookieOptions)
    res.status(statusCode).json({
      accessToken,
      refreshToken
    })
  } catch (error) {
    console.error(error)
    next(createError.createError(500, 'Internal server error: '))
  }
}

exports.login = async (req, res, next) => {
  try {
    let company
    const { email, password, companyCode } = req.body

    //check if email and password exist company code
    if (!email || !password || !companyCode) {
      return next(
        createError.createError(
          400,
          'please provide email, password or company code'
        )
      )
    }
   
    //check if user exists and password is correct
    company = await Company.findOne({ where: { email:email } })
    if(company && company?.status =='pending') {

       return next(createError.createError(401,"Waiting for approval"));
    }

console.log("passwords: " + company?.status)
    if (company === null) {
      company = await Employee.findOne({
        where: { email },
        include: [
          {
            model: CustomRole,
            include: [Permission]
          }
        ]
      })
    }

   
    if (!company || !(await bcrypt.compare(password, company.password))) {
      return next(
        createError.createError(
          401,
          'Unauthorized access - Invalid email, password or company code'
        )
      )
      // return res.status(401).json({
      //   message: 'Unauthorized access - Invalid email, password or company code'
      // })
    }
    if (company.role === 'employee' || company.role === 'approver') {
      createSendToken(company, 200, res, next)
    } else {
      if (company.status === 'active') {
        createSendToken(company, 200, res, next)
      } else {
        switch (company.status) {
          case 'pending':
            return res.status(401).json({
              message: 'your request is being processed please stay tune'
            })
          case 'blocked':
            return res.status(401).json({
              message: 'Your account has been blocked'
            })
          case 'denied':
            return res.status(401).json({
              message: 'Your account has been denied'
            })
          default:
            return res.status(401).json({
              message: 'Unknown status'
            })
        }
      }
    }
  } catch (err) {
    console.log("Failed to create",err)
    return next(createError.createError(500, 'Internal server error'))
  }
}

///super admin login
exports.superAdminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    //check if email and password exist company code
    if (!email || !password) {
      return next(
        createError.createError(400, 'please provide email, password')
      )
    }
    //check if user exists and password is correct
    const user = await User.findOne({ where: { email } })
    if (
      !user ||
      user.role != 'superAdmin' ||
      !(await bcrypt.compare(password, user.password))
    ) {
      next(createError.createError(401, 'Incorrect email or password '))
    } else {
      return createSendToken(user, 200, res, next)
    }

    //if everything is ok send token to the client
  } catch (error) {
    return next(createError.createError(500, 'Internal server error'))
  }
}

exports.logout = async (req, res, next) => {
  try {
    if (req.cookies && req.cookies.jwt) {
      // Access the JWT cookie
      const jwtCookie = req.cookies.jwt

      // Clear the JWT cookie
      res.clearCookie('jwt')

      // Send a JSON response for successful logout
      res.status(200).json({ message: 'Logout successful' })
    } else {
      // Handle the case where the JWT cookie is not present
      res.status(401).json({ message: 'User is not logged in' })
    }
  } catch (error) {
    return next(createError.createError(500, 'Internal server error'))
  }
}

const verifyRefreshToken = refreshToken => {
  try {
    const decoded = jwt.verify(refreshToken, 'refreshSecret')
    return decoded
  } catch (err) {
    // return next(createError.createError(500,"Invalid refresh token"));
    throw new Error('Invalid refresh token')
  }
}

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return next(createError.createError(400, 'Refresh token is missing'))
    }

    const decoded = verifyRefreshToken(refreshToken)

    // Use the decoded information to generate a new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      'secret',
      {
        expiresIn: '90d'
      }
    )

    res.status(200).json({
      accessToken: newAccessToken
    })
  } catch (error) {
    next(createError.createError(500, error.message))
  }
}

exports.getProfile = async (req, res, next) => {
  try {
    const excludedFields = ['password', 'updatedAt']

    const filteredUserData = Object.keys(req.user.toJSON())
      .filter(key => !excludedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.user[key]
        return obj
      }, {})

    return res.status(200).json({ 
      success:true,
      message:"Data found",
      data: filteredUserData })
  } catch (error) {
    return next(createError.createError(500, 'Internal server error'))
  }
}
