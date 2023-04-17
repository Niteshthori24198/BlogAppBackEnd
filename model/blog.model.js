const mongoose = require('mongoose')

const { UserModel } = require('./user.model')


const blogSchema = mongoose.Schema({

   AuthorID:{type: mongoose.Schema.Types.ObjectId , ref: UserModel, required:true},
   Title:{type:String, required:true},
   Description:{type:String, required:true}

},

    {versionKey:false}

)


const BlogModel = mongoose.model("blog", blogSchema)

module.exports = {
    BlogModel
}