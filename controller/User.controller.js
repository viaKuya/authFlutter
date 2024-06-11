const userModel = require('../model/User.model')
const bcrypt = require('bcrypt')
const generateToken = require('../util/generateToken')

const registerUser = async (req,res)=>{

    try{
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const password = await bcrypt.hash(req.body.password,10)
        const date = Date.now()

        //check email exist
        const emailExist = await userModel.findOne({
            email:email
        })

        if(emailExist){
            return res.status(200).json({
                success:false,
                message:"email already taken!"
            })
        }

        //register user
        const user = new userModel({
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:password,
            date:date,
        })

        await user.save()

        res.status(201).json({
            success:true,
            message:"succefully register"
        })
        
    }catch(err){
        res.status(400).json({
            message:err.message
        })
    }
}

const loginUser = async (req,res)=>{
    
    try{
        const email = req.body.email
        const password = req.body.password

        //check userExist
        const userExist = await userModel.findOne({
            email:email
        })
        if(!userExist){
            return res.status(200).json({
                success:false,
                message:"email not found"
            })
        }

        //check passwordMatch
        const passwordMatch = await bcrypt.compare(password,userExist.password)
        if(!passwordMatch){
            return res.status(200).json({
                success:false,
                message:"email and password invalid"
            })
        }

        //payload
        const payload = {
            id:userExist._id,
            firstname:userExist.firstname,
            lastname:userExist.lastname,
            email:userExist.email
        }
        
        res.status(200).json({
            success:true,
            user:{
                id:userExist._id,
                firstname:userExist.firstname,
                lastname:userExist.lastname,
                email:userExist.email,
                token:generateToken(payload)
            }
            
        })
    }catch(err){
        res.status(400).json({
            message:err.message
        })
    }

}
const jwt = require('jsonwebtoken')
require('dotenv').config()
const dashboard = async (req,res) =>{
    try{
        // console.log(req.headers)
        const authHeader  = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(302).json({
                message:"error token"
            })
        }

        const userInfo = await userModel.findOne({
            _id:decoded.id
        })
        
        res.status(200).json({
            id:userInfo.id,
            firstname:userInfo.firstname,
            lastname:userInfo.lastname,
            email:userInfo.email
        })
    }catch(err){
        res.status(400).json({
            meessage:err.message
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    dashboard
}
