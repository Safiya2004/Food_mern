    const express=require('express');
    const datas=require('./models/itemModel');
    const app=express();
    const db=require('./db.js');
    app.use(express.json());
    
    const datasRoute=require('./routes/datasRoute.js')
    const userRoute=require('./routes/userRoute.js')
    const ordersRoute=require('./routes/ordersRoute.js')
    app.get('/',(req,res)=>{
        res.send("Server Working");
    });
    
    app.use('/api/datas/',datasRoute)
    app.use('/api/users/',userRoute);
    app.use('/api/orders/',ordersRoute);
    const port=process.env.PORT || 5000;
    app.listen(port,()=>{
        `Server listening on port ${port}`
    });