const express = require('express');
const productReview= require('../models/product_review');

const ProductReviewRouter = express.Router();

ProductReviewRouter.post('/api/product-review',async (req, res) => {
    try {
        const {buyerId, email, fullName, productId, rating, review} = req.body;
        const productReviews = new productReview({buyerId, email, fullName, productId, rating, review});
        await productReviews.save();
        return res.status(201).send(productReviews);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
 
});


ProductReviewRouter.get('/api/reviews',async (req, res) => {
    try {
        const reviews = await productReview.find(); 
        return res.status(200).send(reviews);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
 
});
module.exports = ProductReviewRouter