require('dotenv').config();
const express = require("express")
const jwt = require("jsonwebtoken")
const Admin = require("../Schemas/AdminSchema")
const adminmiddleware = async (req,res,next) => {
try {
    const token = req.header("Authorization")

    if(!token){
      return  res.status(400).json({msg:"token not found"})
        
    }
const jwtToken = token.trim().replace("Bearer","").trim()



const decoded =  jwt.decode(jwtToken,process.env.JWT_KEY)




//  if (decoded.role != "admin") {
//     return res.status(404).json({ msg: "Access denied. Not an admin." });
// }

const AdminData = await Admin.findOne({email:decoded.email}).select({password:0})


req.admin = AdminData
req.AdminToken = jwtToken
next()

} catch (error) {
    console.log(error);
    
}
    
}

module.exports =  adminmiddleware