const mongoose=require('mongoose');
var mongoURL='mongodb+srv://Shannu:safiya@cluster0.amaxsnr.mongodb.net/SRDS_Mern';
mongoose.connect(mongoURL);
var db=mongoose.connection
db.on('connected',()=>{
    console.log('Database Connection successful');
})
db.on('error',()=>{
    console.log('MongoDb connection failed');
})
module.exports=mongoose;