const express = require("express");
const orderRouter = express.Router();

const Order = require('../models/order');
//Post route for creating orders
orderRouter.post('/api/orders', async (req, res) => {
    try {
        const {fullName, 
            email,
            state, 
            city,
            locality, 
            productName, 
            productPrice, 
            quantity, 
            category, 
            image,
            vendorId, 
            buyerId,              
        } = req.body;
        const createdAt = new Date().getMilliseconds(); //  Get the current date
        // Created new order instance with the extracated fields
        const newOrder = new Order({
            fullName, 
            email,
            state, 
            city,
            locality,
            productName, 
            productPrice,
            quantity,
            category,
            image, 
            vendorId,
            buyerId,
            createdAt
        });
        await newOrder.save();
        return res.status(201).send(newOrder);
        
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});
// GET route for fetching orders by buyerID
orderRouter.get('/api/orders/:buyerId', async (req, res) => {
    try {
        // extract the buyerId from the request parameters
        const {buyerId} = req.params;
        // find all orders in the database that match the buyerId
        const orders = await Order.find({buyerId});
        // if no orders are found, return 404 page not found status with an error message
        if(orders.length == 0){
            return res.status(404).json({msg: "No orders found for this buyer!"});
        }
        // if orders are found, return 200 status with the orders
        return res.status(200).json(orders);
    } catch (e) {
        // handle any errors that occur during the order retrieval process
        res.status(500).json({error: e.message});
    }
});

module.exports = orderRouter;
