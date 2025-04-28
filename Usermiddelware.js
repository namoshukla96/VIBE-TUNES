const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../Schemas/UserSchema");


const authmiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(400).json({ msg: "Token not found" }); // Returning early
        }
        // console.log("token",token);
        

        const jwtToken = token.trim().replace("Bearer", "").trim();
        // console.log("jwtToken",jwtToken);
        
        
        // Verify token
        const verify =  jwt.decode(jwtToken, process.env.JWT_SECRET_KEY);
       
        

        // Find user based on email from the decoded token
        const userData = await User.findOne({ email: verify.email }).select({ password: 0 });


        
        if (!userData) {
            return res.status(404).json({ msg: "User not found" }); // If no user is found
        }

        // Attach user data and token to the request object
        req.user = userData;
        req.token = jwtToken;

        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.error("Authentication Middleware Error:", error);

        // Return a 401 response for invalid or expired token
        res.status(401).json({ msg: "Unauthorized. Invalid or expired token." });
    }
};

module.exports = authmiddleware;
