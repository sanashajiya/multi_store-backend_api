const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');

//End point for sign up api
authRouter.post('/api/signup',async (req,res)=>{
try {
    const {username, email, password} = req.body; 
    const existingEmail = await User.findOne({email});
    if (existingEmail) {
        return res.status(400).json({message:"User with same email already exists"});
    }
    else{
        const hashedPassword = await bcrypt.hash(password, 8);
        const newUser = new User({username, email, password: hashedPassword});
        await newUser.save();
        res.status(201).json({message:"User registered successfully"});
    }
} catch (error) {
    res.status(500).json({error: error.message});
}
});



//End point for sign in api
authRouter.post('/api/signin', async (req,res)=>{
try {
    const {email, password: inputPassword} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        return res.status(400).json({message:"User not found"});
    }
    const isMatch = await bcrypt.compare(inputPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({message:"Invalid credentials"});
    }
    const token = jwt.sign({id: user._id}, "passwordKey");
    // remove sensitive information
    const {password, ...userWithoutPassword} = user._doc;
    
    // send the response
    res.json({token,user: userWithoutPassword});
} catch (error) {
    res.status(500).json({error: error.message});
}
});


// Put route for updaating user state, city and locality
authRouter.put('/api/users/:id',async(req, res)=>{
    try {
        // Extract the 'id' parameter from the request url
        const {id} = req.params;
        // Extract the "State", "City" and "Locality"
        const {state, city, locality} = req.body;
        //Find the user by their ID and update the state, city and locality fields
        // the {new:True} option ensures updated document is returned
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {state, city, locality}, 
            {new:true},
        );
        // if no user is found, return 404 page not found status with an error message
        if(!updatedUser){
            return res.status(404).json({error: "User not Found!"});
        }
        return res.status(200).json(updatedUser);
    } catch (e) {
        res.status(500).json(e.message);
    }
})

module.exports = authRouter;