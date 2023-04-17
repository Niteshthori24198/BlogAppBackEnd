const {Router} = require('express')

const blogRouter = Router()

const {BlogModel} = require('../model/blog.model')

const { Auth } = require('../middlewares/auth')


const mongoose = require('mongoose')

const { UserModel } = require('../model/user.model')

const { verifyRole } = require('../middlewares/verifyrole')




blogRouter.post("/add", Auth ,async (req,res)=>{

    const {Title , Description} = req.body;

    const AuthorID = req.body.UserID;


    try {
        
        const blog = new BlogModel({AuthorID,Title,Description})

        await blog.save()

        return res.status(200).send({
            "msg":"Blog created successfully",
            "Blog":blog
        })

    } 
    
    catch (error) {
        return res.status(400).send({
            "msg":error.message
        })
    }

})



blogRouter.get("/get" , Auth, async(req,res)=>{


    let {UserID} = req.body;

    UserID = new mongoose.Types.ObjectId(UserID)

    try {
        
        const vlogs = await UserModel.aggregate([{$match:{_id:UserID}}, {$lookup : {from:"blogs" , localField:"_id", foreignField:"AuthorID", as:"Blogs"} } , {$project:{Email:1, Name:1,Role:1,"Blogs.Title":1, "Blogs.Description":1 , "Blogs._id":1}}])

        return res.status(200).send({
            "msg":"blog fetched successfully",
            "Blog":vlogs
        })

    } 
    
    catch (error) {
        return res.status(400).send({
            "msg":error.message
        })
    }

})


blogRouter.delete("/delete/:ID" , Auth , verifyRole(["User", "Moderator"]), async(req,res)=>{

    const {ID} = req.params;

    try {
        
        await BlogModel.findByIdAndDelete({_id:ID})

        return res.status(200).send({
            "msg":"Blog deleted successfully"
        })

    }
    
    catch (error) {
        return res.status(400).send({
            "msg":error.message
        })
    }

})



blogRouter.patch("/update/:ID" , Auth , verifyRole(["User"]), async(req,res)=>{

    const {ID} = req.params;


    try {
        
        await BlogModel.findByIdAndUpdate({_id:ID},{...req.body})

        const blog = await BlogModel.findOne({_id:ID})

        return res.status(200).send({
            "msg":"Blog Updated Successfully",
            "blog":blog
        })

    } 
    
    catch (error) {
        return res.status(400).send({
            "msg":error.message
        })
    }

})





module.exports = {
    blogRouter
}