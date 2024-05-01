const mongoose=require('mongoose');
const itemSchema=mongoose.Schema({
    name:{type:String,require},
    varients:[],
    Prices:[],
    Category:{type:String,require},
    Image:{type:String,require},
    Description:{type:String,require},
},{
    timestamps:true,
})
const itemModel=mongoose.model('data',itemSchema);
module.exports=itemModel;