const express = require('express')

const { connection } = require('./db')

const { userRouter } = require('./routes/user.routes')

const {blogRouter} = require('./routes/blog.routes')

const cookieParser = require('cookie-parser')

require('dotenv').config()

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use("/user", userRouter)

app.use("/blog", blogRouter)


app.all("*" , (req,res)=>{
    res.send("Invalid URl !! Error 404")
})






app.listen(process.env.port , async (req,res)=>{

    try {

        await connection
        console.log("Connected to db. server running !")

    } 
    
    catch (error) {
        console.log(error)
    }

})