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
            return res.status(400).json({message:'User Login failed'});
        }
    }
    catch(error)
    {
        return res.status(400).json({message:error});
    }
})
router.get('/getallusers',async (req,res)=>{
    try {
        const users=await User.find({})
        res.send(users)
    } catch (error) {
        return res.status(400).json({message:error})
    }
})
router.post('/deleteuser',async (req,res)=>{
    const userid=req.body.userid
    try {
        await User.findOneAndDelete({_id:userid})
        res.send("User deleted Successfully")
    } catch (error) {
        return res.status(400).json({message:error})
    }
})
module.exports=router;