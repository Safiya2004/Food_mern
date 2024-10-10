const express=require('express');
const router=express.Router();
const Data=require('../models/itemModel')
router.get("/getalldatas",async (req,res)=>{
    try{
        const datas=await Data.find({});
        res.send(datas);
    }
    catch(error)
    {
        return res.status(500).json({Message:error});
    }
});
router.post("/additems", async (req, res) => {
    const { name, image, description, category, variants, prices } = req.body.item;
    try {
        const newItem = new Data({
            name: name,
            Image: image,
            Description: description,
            Category: category,
            varients: variants,
            Prices: prices
        });
        await newItem.save();
        res.send('New Item added Successfully');
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});
router.post('/getitembyid',async (req,res)=>{
    const itemid=req.body.itemid;
    try{
        const item=await Data.findOne({_id:itemid})
        res.send(item)
    }
    catch(error)
    {
        return res.status(400).json({message:error})
    }
})
router.post('/edititems',async (req,res)=>{
    const updatedItem=req.body.updatedItem
    try{
        const item=await Data.findOne({_id:updatedItem._id})
        item.name=updatedItem.name;
        item.Description=updatedItem.description;
        item.Image=updatedItem.image;
        item.Category=updatedItem.category;
        item.Prices=updatedItem.prices;
        item.varients=updatedItem.variants;
        await item.save();
        res.send("Item details edited successfully");
    }
    catch(error)
    {
        return res.status(400).json({message:error});
    }
})
router.post('/deleteitem',async (req,res)=>{
    const itemid=req.body.itemid
    try {
        await Data.findOneAndDelete({_id:itemid})
        res.send("Pizza Deleted Successfully")
    } catch (error) {
        return res.status(400).json({message:error})
    }
})
module.exports=router;