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
    const { email, password, firstName, lastName,  role } = req.body;
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
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                ErrorModel: {
                    errorCode: httpCodes.INTERNAL_SERVER_ERROR,
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

            let hashedPass = await bcrypt.hash(req.body.password, 10);

            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashedPass,
                profileImage: req.body.profileImage,
                role: req.body.role
            });
            // const admin = new User({
            //     firstName: req.body.firstName,
            //     lastName: req.body.lastName,
            //     email: req.body.email,
               
            // });
            // userManagement.User.aggregate({
            //     $lookup: {
            //         from: "address", localField: ["address"],
            //         foreignField: "address", as: "newAddress"
            //     }
            // })
            // //join

            let createUser = await user.save()
            let createAdmin = await admin.save()
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
//login-admin
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
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
            ErrorModel: {
                errorCode: httpCodes.INTERNAL_SERVER_ERROR,
                errorMessage: "user not found"

            }
        });
    } else {

        let verify = await bcrypt.compare(password, user.password);
        if (verify) {
            const token = jwt.sign({ name: user.name }, "verySecretiveValue", { expiresIn: "5min" })
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


//show-admin
const show = async (req, res, next) => {
    const id = req.params.id
    const userInfo = await User.findById(id)
    if (userInfo) {
        return res.status(httpCodes.OK).json({
            data: userInfo,
            message: "Success"
        });
    } else {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
            ErrorModel: {
                errorCode: httpCodes.INTERNAL_SERVER_ERROR,
                errorMessage: "failed to fetch user information"
            }
        });
    }


}


//update
const update = async (req, res, next) => {
    const {
        email,
        phone,
        firstName,
        lastName,
        password,
        Address
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
        phone: Joi.string().required().messages({
            'string.empty': `Enter valid phone number`,
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
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                ErrorModel: {
                    errorCode: httpCodes.INTERNAL_SERVER_ERROR,
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
                phone: req.body.phone,
                Address: req.body.Address,
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
//delete
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


//disable
const disable = async (req, res, next) => {
    const id = req.params.id
    const userInfo = await User.findByIdAndlo(id)
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

//change password
const change = async (req, res, next) => {
    const id = req.params.id
    const userInfo = await User.findOne(id)
    if (userInfo) {
        
        const old_password = req.body.oldpassword;
        const new_password = req.body.newpassword;
        const confirm_password = req.body.confirmpassword;
        return res.status(httpCodes.OK).json({
            data: userInfo,
            message: "password has been changed successfully"
        });
    } else {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
            ErrorModel: {
                errorCode: httpCodes.INTERNAL_SERVER_ERROR,
                errorMessage: "unable to change password"
            }
        });
    }


}



exports.register = register;
exports.login = login;
exports.show = show;
exports.update = update;
exports.remove = remove;

exports.change = change;

 //const admin = await User.find({user: req.user.id}))
 //res.json(asmins);
 //}catch(err){
     //console.log(err.message);
    // res.status(500).send("server error");
// }