const express = require('express');
const Vendor = require('../models/vendor');
const vendorRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



vendorRouter.post('/api/vendor/signup',async (req,res)=>{
    try {
        const {username, email, password} = req.body; 
        const existingEmail = await Vendor.findOne({email});
        if (existingEmail) {
            return res.status(400).json({message:"Vendor with same email already exists"});
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 8);
            const vendor = new Vendor({username, email, password: hashedPassword});
            await vendor.save();
            res.json({vendor});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

vendorRouter.post('/api/vendor/signin', async (req,res)=>{
    try {
        const {email, password: inputPassword} = req.body;
        const vendor = await Vendor.findOne({email});
        if (!vendor) {
            return res.status(400).json({message:"Vendor not found"});
        }
        const isMatch = await bcrypt.compare(inputPassword, vendor.password);
        if (!isMatch) {
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token = jwt.sign({id: vendor._id}, "passwordKey");
        // remove sensitive information
        const {password, ...vendorWithoutPassword} = vendor._doc;
        
        // send the response
        res.json({token,vendor: vendorWithoutPassword});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
    });
        
module.exports = vendorRouter;
    