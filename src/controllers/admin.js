const Admin = require('../models/admin')
const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const { hashSync, genSaltSync } = require("bcrypt");
const jwt = require('jsonwebtoken')
require("dotenv").config(); 

const login = async(req, res, next) => {
    try{
        var email = req.body.email
        var password = req.body.password
        
        Admin.findOne({$or: [{email: email}, {password: password}]})
            .then(admin => {
                if(admin){
                    bcrypt.compare(password, admin.password, function(err, result){
                        if(err){
                            res.json({
                                error: err
                            })
                        }

                        if(result){
                            let token = jwt.sign({email:admin.email, id: admin._id,admin:true}, process.env.JWT_KEY)
                            res.json({
                                message: 'Login Successful!',
                                token: token,
                            })
                        }else{
                            res.json({
                                message: "Id or password is invalid"
                            })
                        }
                    })
                }else{
                    res.json({
                        message: 'Id or password is invalid'
                    })
                }
            })
    }catch (error) {
        res.json({
          message: "Id or password is invalid"
        })
    }
}

const signUp = async (req, res) => {
    try{
        const body = req.body;

        const salt = genSaltSync(10);

        try {
            body.password = hashSync(body.password, salt);
        } catch (error) {
            res.json({
                message: "password error"
            })
        }

        let admin = new Admin({
            email: body.email,
            password: body.password,
           
        })
        
        admin.save()
        .then(response => {
            res.json({
            message: "Sign up is successfully",
            obj:response
            })
        })
    }catch(error){
        res.json({
            message: "error"
        })
    }
}
const auth = async (req, res) => {
    try{
        if(req.body.decoded.admin){
            res.json({
                auth:true
            })
        }
        else{
            res.json({
                auth:false
            })
        }

        
          
    }catch(error){
        res.json({
            auth:false
        })
    }
}



module.exports={
    login,signUp,auth
}