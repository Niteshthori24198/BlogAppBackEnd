const { Router } = require('express')

const userRouter = Router()

require('dotenv').config()

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const { UserModel } = require('../model/user.model')

const { BlackListModel } = require('../model/blacklist.model')




userRouter.post("/register", async (req, res) => {

    const { Email, Name, Password, Role } = req.body;

    if (!Email || !Name || !Password) {

        return res.status(400).send({
            "msg": "kindly provide all required fields"
        })

    }


    try {

        const ispresent = await UserModel.findOne({ Email })

        if (ispresent) {

            return res.status(400).send({
                "msg": "User Already Exists.",
                "User": ispresent
            })

        }


        bcrypt.hash(Password, 5, async (err, hash) => {

            if (err) {

                return res.status(400).send({
                    "msg": "something went wrong kindly retry once."
                })
            }

            const user = new UserModel({ Email, Name, Role, Password: hash })

            await user.save()

            return res.status(200).send({
                "msg": "User register Successfully",
                "User": user
            })

        })

    }

    catch (error) {

        return res.status(400).send({
            "msg": error.message
        })

    }





})



userRouter.post("/login", async (req, res) => {

    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).send({
            "msg": "Kindly provide required details"
        })
    }


    try {

        const ispresent = await UserModel.findOne({ Email })

        if (!ispresent) {
            return res.status(400).send({
                "msg": "User does not exists"
            })
        }

        bcrypt.compare(Password, ispresent.Password, async (err, result) => {

            if (!result) {
                return res.status(400).send({
                    "msg": "Invalid Password"
                })
            }

            const token = jwt.sign({ UserID: ispresent._id, Role: ispresent.Role }, process.env.AccessTokenSecret, { expiresIn: "30m" })

            const refreshtoken = jwt.sign({ UserID: ispresent._id, Role: ispresent.Role }, process.env.RefreshTokenSecret, { expiresIn: "60m" })

            res.cookie("refreshtoken", refreshtoken, { maxAge: 1000 * 60 * 3 })

           

            return res.status(200).send({
                "msg": "Login Done",
                "token": token
            })


        })


    }

    catch (error) {
        return res.status(400).send({
            "msg": error.message
        })
    }


})



userRouter.get("/logout", async (req, res) => {

    const authheader = req.headers.authorization;

    if (!authheader) {
        return res.status(400).send({
            "msg": "token isn't passes. "
        })
    }

    const token = authheader.split(' ')[1]

    if (token) {

        try {

            const blacklist = new BlackListModel({ Token: token })

            await blacklist.save()

            return res.status(200).send({
                "msg": "Logout Done"
            })

        }

        catch (error) {
            return res.status(400).send({
                "msg": error.message
            })
        }

    }

    else {
        return res.status(400).send({
            "msg": "token is not passed."
        })
    }

})



userRouter.get('/gettoken', async (req, res) => {


    console.log('req came')

    console.log(req.cookies)
    const refreshtoken = req.cookies.refreshtoken;

    console.log(refreshtoken)

    try {

        const decodeed = jwt.verify(refreshtoken, process.env.RefreshTokenSecret)

        res.send(decodeed)

    } catch (error) {
        res.send(error.message)

    }

})




module.exports = {
    userRouter
}