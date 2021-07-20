const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const httpCodes = require("http-status-codes");


//registeruser
const register = async (req, res, next) => {

    console.log(req.body)
    console.log(req.file)
    // return true;

    const { email, firstName, lastName, password, status, profileImage } = req.body;
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
        // address: Joi.string().required().messages({
        //     'string.empty': `address is required`,
        // }),
        role: Joi.string().required().messages({
            'string.empty': `role is required`,
        }),
        status: Joi.string().required().messages({
            'string.empty': `role is required`,
        }),
        profileImage: Joi.string(),

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
            console.log(req.file)
            if (req.file == undefined) {
                res.status(400).send(' Error: No File Selected!');
            } else {
                req.body.profileImage = `${req.file.filename}`;
                userData = {
                    profileImage: req.body.profileImage
                };
            }

            // let hashedPass = await bcrypt.hash(req.body.password, 10);

            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                profileImage: req.body.profileImage,
                status: req.body.status
            });


            let createUser = await user.save()

            if (createUser) {
                console.log(createUser);
                return res.status(httpCodes.OK).json({
                    message: "User created Successfully"
                });
            } else {
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                    ErrorModel: {
                        errorCode: httpCodes.INTERNAL_SERVER_ERROR,
                        errorMessage: "User not created"
                    }
                });
            }
        }

    }
}
//login-user

const login = async (req, res, next) => {

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

    //user not found
    const user = await User.findOne({ $or: [{ email: username }] })
    if (!user) {
        console.log(user)
        return res.status(httpCodes.NOT_FOUND).json({
            ErrorModel: {
                errorCode: httpCodes.NOT_FOUND,
                errorMessage: "user not found"

            }
        });
    } else {

        let verify = await User.findOne({ $or: [{ password: password }] });
        if (verify) {
            const token = jwt.sign({ name: user.id }, "verySecretiveValue", { expiresIn: "24hrs" })
            console.log(user);
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





//update-user

const update = async (req, res, next) => {

    const {
        email,
        firstName,
        lastName,
        password,
        role,
        status

    } = req.body;
    const id = req.params.id
    const updateSchema = Joi.object().keys({
        email: Joi.string().required().email().messages({
            'string.empty': `Email is required`,
            'string.email': `Email is incorrect`,
        }),
        password: Joi.string().required().messages({
            'string.empty': `Password is required`,
        }),
        firstName: Joi.string().required().messages({
            'string.empty': `Name is required`,
        }),
        lastName: Joi.string().required().messages({
            'string.empty': `Name is required`,
        }),
        Address: Joi.string().required().messages({
            'string.empty': `Name is required`,
        }),
        role: Joi.string().required().messages({
            'string.empty': `Enter a role`,
        }),
        status: Joi.string().required().messages({
            'string.empty': `Enter a role`,
        }),
        profileImage: Joi.string().required().messages({
            'string.empty': 'choose a file',
        })
    });
    const result = await updateSchema.validate(req.body);
    const { value, error } = result;
    const valid = error == null;
    if (valid) {
        const { details } = error;
        const message = details.map(i => i.message).join(',');
        return res.status(httpCodes.UNPROCESSABLE_ENTITY).json({
            ErrorModel: {
                errorCode: httpCodes.UNPROCESSABLE_ENTITY,
                errorMessage: message
            }
        });
    } else {
        const doesExist = await User.findOne({ email: email, '_id': { $ne: id } })
        if (doesExist) {
            console.log(error)
            return res.status(httpCodes.BAD_REQUEST).json({
                ErrorModel: {
                    errorCode: httpCodes.BAD_REQUEST,
                    errorMessage: "email already exist"

                }
            });
        } else {
            console.log(req.file)
            if (req.file == undefined) {
                res.status(400).send(' Error: No File Selected!');
            } else {
                req.body.profileImage = `${req.file.filename}`;
                userData = {
                    profileImage: req.body.profileImage
                };
            }

            const updateData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                role: req.body.role,
                status: req.body.status,
                profileImage: req.body.profileImage
            };
            const update = await User.findByIdAndUpdate(id, { $set: updateData })
            if (update) {
                console.log(update);
                return res.status(httpCodes.OK).json({
                    data: id,
                    message: "Successfully updated"
                });
            } else {
                console.log(update);
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                    ErrorModel: {
                        errorCode: httpCodes.INTERNAL_SERVER_ERROR,
                        errorMessage: "failed to update"
                    }
                });
            }
        }

    }
}
//delete-user

const remove = async (req, res, next) => {

    const id = req.params.id
    const userInfo = await User.findByIdAndDelete(id)
    if (userInfo) {
        return res.status(httpCodes.OK).json({
            data: userInfo,
            message: "user deleted Successfully"
        });
    } else {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
            ErrorModel: {
                errorCode: httpCodes.INTERNAL_SERVER_ERROR,
                errorMessage: "unable to delete user"
            }
        });
    }
}

//disable-user
const disable = async (req, res, next) => {

    const id = req.params.id
    // const uDisable = await User.findByIdAndUpdate(id, { active: false })
    // if (uDisable) {
    //     return res.status((httpCodes.OK).json({
    //         message
    //     }))
    // }
    // else {
    const disableUser = await User.findByIdAndRemove(id)
    if (disableUser) {
        return res.status(httpCodes.OK).json({
            data: disableUser,
            message: "user disabled Successfully"
        });
    } else {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
            ErrorModel: {
                errorCode: httpCodes.INTERNAL_SERVER_ERROR,
                errorMessage: "unable to disable user"
            }
        });
    }
}







//change password
const change = async (req, res, next) => {
    const  password  = req.body.password;
    console.log(req.body.password)
    const id = req.params.id
    const changeSchema = Joi.object().keys({
        password: Joi.string().required().messages({
            'string.empty': `Password is required`,
        }),
    })
    const result = await changeSchema.validate(req.body);
   
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
        const doesExist = await User.findOne({ password: password, '_id': { $ne: id } })
        if (doesExist) {
            console.log(error)
            return res.status(httpCodes.BAD_REQUEST).json({
                ErrorModel: {
                    errorCode: httpCodes.BAD_REQUEST,
                    errorMessage: "password already exist"

                }
            });
         }
          else {
        
        const changePassword = {
            password: req.body.password
        }
        const change = await User.findByIdAndUpdate(id, { $set: changePassword })
        if (change) {
            console.log(password);

            return res.status(httpCodes.OK).json({
                message: "password changed Successfully"
            });
        } else {
            console.log(change);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                ErrorModel: {
                    errorCode: httpCodes.INTERNAL_SERVER_ERROR,
                    errorMessage: "failed to change password"
                }
            });
        }
    }


}

}

exports.register = register;
exports.login = login;
exports.update = update;
exports.remove = remove;
exports.disable = disable;
exports.change = change;