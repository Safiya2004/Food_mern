const express=require('express');
const router=express.Router();
const User=require('../models/userModel');
router.post('/register',async (req,res)=>{
    const{name,email,Password}=req.body
    const newUser=new User({name,email,Password});
    try{
        newUser.save()
        res.send('User registered Successfully')
    }
    catch(error)
    {
        return res.status(400).json({message:error});
    }
})
router.post('/login',async (req,res)=>{
    const{name,Password}=req.body
    try{
        const user= await User.find({name,Password})
        if(user.length>0)
        {
            const currentUser={
                name:user[0].name,
                email:user[0].email,
                isAdmin:user[0].isAdmin,
                _id:user[0]._id
            }
            res.send(currentUser)
        }
        else{
            return res.status(400).json({message:'User Logged in failed'});
        }
    }
    catch(error)
    {
        return res.status(400).json({message:error});
    }
})
module.exports=router;