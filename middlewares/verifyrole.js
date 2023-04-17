
const verifyRole = (permittedrole)=>{

    return (req,res,next)=>{

        const Role = req.body.Role;

        if(permittedrole.includes(Role)){
            next()
        }

        else{
            return res.status(400).send({
                "msg":"Unauthorized access detected"
            })
        }

    }

}


module.exports = {
    verifyRole
}