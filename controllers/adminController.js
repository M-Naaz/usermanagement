const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const httpCodes = require("http-status-codes");


//registeradmin
const registerad = async (req, res, next) => {
   console.log(req.body)
    const { email, password, firstName, lastName } = req.body;
    /** Validation */
    const registerSchema = Joi.object().keys({
        email: Joi.string().required().email().messages({
            'string.empty': `Email is required`,
            'string.email': `Email is incorrect`,
        }),
        password: Joi.string().required().messages({
            'string.empty': `Password is required`,
        }),
        firstName: Joi.string().required().messages({
            'string.empty': `firstName is required`,
        }),
        lastName: Joi.string().required().messages({
            'string.empty': `lastName is required`,
        }),

        role: Joi.string().required().messages({
            'string.empty': `role is required`,
        }),
       


    });

    const result = await registerSchema.validate(req.body);
    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
        const { details } = error;
        const message = details.map(i => i.message).join(',');
        return res.status(httpCodes.UNPROCESSABLE_ENTITY).json({
            ErrorModel: {
                errorCode: httpCodes.UNPROCESSABLE_ENTITY,
                errorMessage: message
            }
        });
    } else {
        const doesExist = await User.findOne({ email: email })
        if (doesExist) {
            console.log(doesExist)
            return res.status(httpCodes.BAD_REQUEST).json({
                ErrorModel: {
                    errorCode: httpCodes.BAD_REQUEST,
                    errorMessage: "email already exist"

                }
            });
        } else {


            // let hashedPass = await bcrypt.hash(req.body.password, 10);

            const admin = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
            
            });



            let createAdmin = await admin.save()

            if (createAdmin) {
                console.log(createAdmin);
                return res.status(httpCodes.OK).json({
                    message: "admin created Successfully"
                });
            } else {
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                    ErrorModel: {
                        errorCode: httpCodes.INTERNAL_SERVER_ERROR,
                        errorMessage: "admin not created"
                    }
                });
            }
        }

    }
}
//login-admin
const loginad = async (req, res, next) => {
    
    const { username, password } = req.body;
    const loginSchema = Joi.object().keys({
        username: Joi.string().required().email().messages({
            'string.empty': `email is required`,
            'string.email': `email is incorrect`,
        }),
        password: Joi.string().required().messages({
            'string.password': `Password is incorrect`,
        })
    });
    const result = await loginSchema.validateAsync(req.body)

    //admin not found
    const admin = await User.findOne({ $or: [{ email: username }] })
    if (!admin) {
        console.log(admin)
        return res.status(httpCodes.NOT_FOUND).json({
            ErrorModel: {
                errorCode: httpCodes.NOT_FOUND,
                errorMessage: "admin not found"

            }
        });
    } else {

        let verify = await User.findOne({ $or: [{ password: password }] });
        if (verify) {
            const token = jwt.sign({ name: admin.id }, "verySecretiveValue", { expiresIn: "24hrs" })
            console.log(admin);
            return res.status(httpCodes.OK).json({
                message: "Login successful",
                token
            })
        } else {
            return res.status(httpCodes.BAD_REQUEST).json({
                ErrorModel: {
                    errorCode: httpCodes.BAD_REQUEST,
                    errorMessage: "password does not match"
                }
            })
        }
    }
}

//delete-admin

const removead = async (req, res, next) => {
    
    const id = req.params.id
    const adminInfo = await User.findByIdAndDelete(id)
    if (adminInfo) {
        return res.status(httpCodes.OK).json({
            data: adminInfo,
            message: "admin deleted Successfully"
        });
    } else {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
            ErrorModel: {
                errorCode: httpCodes.INTERNAL_SERVER_ERROR,
                errorMessage: "unable to delete admin"
            }
        });
    }


}

//disable-admin
const disablead = async (req, res, next) => {
    const id =  req.params.id 
    const disableUser = await User.findByIdAndRemove(id)
        if (disableUser) {
            return res.status(httpCodes.OK).json({
                data: disableUser,
                message: "admin disabled Successfully"
            });
        } else {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                ErrorModel: {
                    errorCode: httpCodes.INTERNAL_SERVER_ERROR,
                    errorMessage: "unable to disable admin"
                }
            });
        }
    }

    //show-non admin


exports.registerad = registerad;
exports.loginad= loginad;
exports.removead = removead;
exports.disablead = disablead;















