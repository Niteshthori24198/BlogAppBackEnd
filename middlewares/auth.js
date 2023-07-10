const jwt = require('jsonwebtoken')

const { UserModel } = require('../model/user.model')

const {BlackListModel} = require('../model/blacklist.model')

require('dotenv').config()


const Auth = async (req,res,next)=>{

    const authheader = req.headers.authorization;

    const refreshtoken = req.cookies.refreshtoken;

    if(!authheader){
        return res.status(400).send({
            "msg":"token required to access protected route."
        })
    }

    const token = authheader.split(' ')[1]

    if(token){

        try {
            
            const blacklisttoken = await BlackListModel.findOne({Token:token})

            if(blacklisttoken){
                return res.status(400).send({
                    "msg":" New token required to access protected route."
                })
            }


            const decoded = jwt.verify(token , process.env.AccessTokenSecret)


            if(decoded){

                req.body.UserID = decoded.UserID;

                req.body.Role = decoded.Role

                next()

            }


        } 
        
        catch (error) {
            
            // generate new token

            const [token , UserID, Role] = generateNewToken(refreshtoken)

            if(token){

                req.headers.authorization = `Bearer ${token}`

                req.body.UserID = UserID

                req.body.Role = Role

                next()

            }

            else{

                return res.status(400).send({
                    "msg":"authorized failed. login required."
                })

            }



        }


    }

    else{
        return res.status(400).send({
            "msg":"token required to access protected route."
        })
    }



}




function generateNewToken(refreshtoken){

    if(!refreshtoken){
        return []
    }

    try {
        
        const decoded = jwt.verify(refreshtoken , process.env.RefreshTokenSecret)

        if(decoded){

            const token = jwt.sign({UserID:decoded.UserID , Role:decoded.Role}, process.env.AccessTokenSecret, {expiresIn:"1m"})

            return [token , decoded.UserID, decoded.Role]

        }

    } 
    
    catch (error) {
        
        return []
    }

}








module.exports = {
    Auth
}

