const Admin = require("../Schemas/AdminSchema")

const adminRegistration = async (req,res) => {
    const {fullName,email,password} = req.body
    const exists = await Admin.findOne({email})
    if (exists) {
   return res.status(400).json({msg:"Admin already exists"})        
    }
    const CreateAdmin = await Admin.create({fullName,email,password})
    const AdminToken = await CreateAdmin.generateTokenAdmin();
    return  res.status(200).json({CreateAdmin, AdminToken}) 
    
}
const adminLogin = async (req,res) => {
    const {email,password} = req.body
    const exists = await Admin.findOne({email})
    await exists.comparePassword(password)
    if (!exists) {
   return res.status(400).json({msg:" Ur not Admin "})        
    }
    const AdminToken = await exists.generateTokenAdmin();
  
    return  res.status(200).json( {exists,AdminToken}) 
    
}

const adminData = async (req,res) => {
 try {
    const admin = req.admin
  
    
    if(admin){
        res.status(200).json(admin)
    }
 } catch (error) {
    console.log(error);
    
 }
    
    
}

module.exports = {adminRegistration,adminLogin,adminData}