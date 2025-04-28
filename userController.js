const express = require('express')
const { exists } = require('../Schemas/UserSchema')
const User = require('../Schemas/UserSchema')

const userRegistration = async (req,res) => {
    const {fullName,email,password} = req.body
    const exists  = await User.findOne({email})
    if(exists){
        return res.status(400).json({msg:"user already exists"})
        console.log("user already exists");
        
    }
  
    const createUser = await User.create({fullName,email,password})
    const token = await createUser.generateToken()

    return res.status(200).json({createUser, token})
}

const userLogin = async (req,res) => {
  try {
    const {email,password }= req.body
    const user = await User.findOne({email}) 
    const token = await user.generateToken()
    if (user) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ msg: "Invalid password" });
      }

     return res.status(200).json({user,token})
    }

  } catch (error) {
   return res.status(400).json({msg:"user login fail"})
  }
}

const getUser = async (req,res) => {
  try {
   const userData = req.user
 
   
   return res.status(200).json(userData)
  } catch (error) {
    
  }
  
}
module.exports = {userRegistration, userLogin, getUser}