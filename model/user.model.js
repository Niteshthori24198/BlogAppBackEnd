const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

    Email:{type:String , required:true , unique:true},
    Name:{type:String,required:true},
    Password:{type:String, required:true},
    Role:{type:String, enum:["Moderator" , "User"], default:"User"}

},

    {versionKey:false}

)


const UserModel = mongoose.model("user", userSchema)

module.exports = {
    UserModel
}