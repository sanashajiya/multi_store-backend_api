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
 
//Get route for fetching all orders by buyerId
orderRouter.get('/api/orders/buyers/:buyerId', async (req, res) => {
    try {
        // extract buyerId from request parameters
        const buyerId = req.params.buyerId;
        // Find all orders in the database with the matching buyerId
        const orders = await Order.find({buyerId});
        // If no orders are found, return a 404 error with a message
        if (orders.length === 0) {
            return res.status(404).json({message: 'No orders found for this buyer'});
        }
        // If orders are found, return them with a 200 status code
        res.status(200).json(orders);
    } catch (e) {
        // Handle any errors that occur during the order retrieval process
        res.status(500).json({error: e.message});
    }
});

//Get route for fetching all orders by vendorId
orderRouter.get('/api/orders/vendors/:vendorId', async (req, res) => {
    try {
        // extract vendorId from request parameters
        const vendorId = req.params.vendorId;
        // Find all orders in the database with that matching vendorId
        const orders = await Order.find({vendorId});
        // If no orders are found, return a 404 error with a message
        if (orders.length === 0) {
            return res.status(404).json({message: 'No orders found for this vendor'});
        }
        // If orders are found, return them with a 200 status code
        res.status(200).json(orders);
    } catch (e) {
        // Handle any errors that occur during the order retrieval process
        res.status(500).json({error: e.message});
    }
});

// Delete route for deleting an order by orderId
orderRouter.delete('/api/orders/:id', async (req, res) => {
    try {
        // extract orderId from request parameters
        const {id} = req.params;
        // Delete the order from the database using the extracted orderId
        const deletedOrder = await Order.findByIdAndDelete(id);
        // Check if an order was found and deleted
        if (!deletedOrder) {
            // If no order was found and deleted, return a 404 error with a message
            return res.status(404).json({message: 'Order not found'});
        }
        else{
            //if the order waas successfully deleted, return a 200 status code with a message
            return res.status(200).json({message: 'Order deleted successfully', deletedOrder});
        }
    } catch (e) {
        // if an error occurs during the order deletion process, return a 500 status code with the error message
        res.status(500).json({error: e.message});
    }
});

orderRouter.patch('/api/orders/:id/delivered', async (req, res) => {
    try {
        const {id} = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(
            id, 
            {delivered: true, processing: false}, 
            {new: true}
        );
        const {status} = req.body;
        if(!updatedOrder){
            return res.status(404).json({message: 'Order not found'});
        }
        return res.status(200).json(updatedOrder);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


orderRouter.patch('/api/orders/:id/processing', async (req, res) => {
    try {
        const {id} = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(
            id, 
            {processing: false, delivered: false}, 
            {new: true}
        );
        const {status} = req.body;
        if(!updatedOrder){
            return res.status(404).json({message: 'Order not found'});
        }
        return res.status(200).json(updatedOrder);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

module.exports = orderRouter;