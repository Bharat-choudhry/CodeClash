
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser=async(req,res)=>{
 try{
   const { username, email, password } = req.body;
    const existingEmail = await User.findOne({ email });
    if(existingEmail) {
       return res.status(400).json({ message: "Email is already registered" });
    }

    const existingUsername = await User.findOne({ username });
    if(existingUsername) {
       return res.status(400).json({ message: "Username is already taken" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });
    
    await newUser.save();
    res.status(201).json({ message: "User successfully registered!" });

 } catch(err){
   console.error("Register Error:", err);
    res.status(500).json({message:"Server Error"});
 }
}

const loginUser=async(req,res)=>{
   const {email,password}=req.body;
   try{
   if(!email ||!password){
       return res.status(400).json({error:"please enter the email and pass both"});
   }

   const user=await User.findOne({email:email});

   if(!user){
     return res.status(404).json({error:"user not found"});
   }
   
   const ispassmatch=await bcrypt.compare(password,user.password);

   if(!ispassmatch){
    return res.status(401).json({error:"wrong password"});
   }

   const token=jwt.sign(
    {userId:user._id},
    process.env.JWT_SECRET,
     {expiresIn:"1d"}
   );

   res.status(200).json({ 
           message: "Login Successful", 
           token: token, 
           user: { username: user.username, email: user.email, elo: user.elo }
       });
       
} catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server mein kuch gadbad hai" });
  }
}



module.exports={registerUser,loginUser};