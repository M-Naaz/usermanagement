const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    profileImage: String,
    password: String,
    status: String,
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    

}, { timestamps: true })
module.exports = mongoose.model("users", userSchema)


//address
const addressSchema = new Schema({

    city: String,
    state: String,
    country: String,
    landmark: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})
// module.exports = mongoose.model("address", addressSchema)

