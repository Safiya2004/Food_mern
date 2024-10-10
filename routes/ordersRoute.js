const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")("sk_test_51P906jSFwbB1dw3sdA4HrsDCIYQIhozkVartgnciL6undqOOuAYa67Dx4vQpCtPJGpWi3OiaIH5PejkD64fpqnrz00K6v0nNd6");
const Order = require('../models/orderModel');

router.post('/placeorder', async (req, res) => {
    const { token, subtotal, currentUser, cartItems } = req.body;

    console.log("Received request to place order:", req.body);

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        console.log("Customer created:", customer);
        const charge = await stripe.paymentIntents.create({
            amount: subtotal * 100,
            currency: 'inr',
            customer: customer.id,
            receipt_email: token.email,
            description: 'Order payment',
            payment_method_types:['card'],
            confirm:true
        });

        console.log("Charge created:", charge); // Log the created charge

        if (charge) {
            const newOrder = new Order({
                name: currentUser.name,
                email: currentUser.email,
                userid: currentUser._id,
                orderItems: cartItems,
                orderAmount: subtotal,
                shippingAddress: {
                    street: token.card.address_line1,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    pincode: token.card.address_zip,
                },
                transactionId: charge.id // Using charge id as transaction id
            });

            console.log("New order created:", newOrder); // Log the created order

            await newOrder.save(); // Use await to ensure order is saved before sending response
            res.send('Order placed Successfully');
        } else {
            res.send('Payment Failed');
        }
    } catch (error) {
        console.error("Error occurred while placing order:", error); // Log any errors that occur
        return res.status(400).json({ message: 'Something went wrong' + error });
    }
});

router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, 'your_webhook_secret'); // Replace 'your_webhook_secret' with your actual webhook secret
    } catch (err) {
        console.error('Error verifying webhook signature:', err);
        return res.sendStatus(400);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Retrieve the order based on paymentIntent.metadata.order_id
            try {
                const order = await Order.findById(paymentIntent.metadata.order_id);
                if (order) {
                    // Update the order status to 'paid' or perform any other necessary actions
                    console.log('Payment for order', order._id, 'succeeded');
                } else {
                    console.error('Order not found:', paymentIntent.metadata.order_id);
                }
            } catch (error) {
                console.error('Error retrieving order:', error);
            }
            break;
        case 'payment_intent.payment_failed':
            console.log('Payment failed:', event.data.object.id);
            // Handle failed payment
            break;
        default:
            console.log('Unhandled event type:', event.type);
    }

    res.sendStatus(200);
});
router.post("/getuserorders",async (req,res)=>{
    const {userid}=req.body
    try{
        const orders=await Order.find({userid:userid}).sort({_id:-1})
        res.send(orders);
    }
    catch(error){
        return res.status(400).json({message:'Something went Wrong'})
    }
})
router.get('/getallorders',async (req,res)=>{
    try {
        const orders=await Order.find({})
        res.send(orders)
    } catch (error) {
        return res.status(400).json({message:error})
    }
})
router.post('/deliverorder',async (req,res)=>{
    const orderid=req.body.orderid
    try {
        const order=await Order.findOne({_id:orderid})
        order.isDelivered=true
        await order.save()
        res.send("Order Delivered successfully")
    } catch (error) {
        return res.status(400).json({message:"Something went Wrong"})
    }
})
module.exports = router;