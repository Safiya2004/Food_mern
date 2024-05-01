const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    name:{type:String,require},
    email:{type:String,require},
    Password:{type:String,require},
    isAdmin:{type:Boolean,require,default:false},
},{
    timestamps:true,
})
module.exports=mongoose.model('users',userSchema);