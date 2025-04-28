const mongoose = require("mongoose")

const connection = async () => {
    await mongoose.connect(process.env.MONGOURL)
    
    console.log(" db connection done");
    
   
    
}

module.exports = connection