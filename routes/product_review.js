const express = require('express');
const productReview= require('../models/product_review');
const Product = require('../models/product');

const ProductReviewRouter = express.Router();

ProductReviewRouter.post('/api/product-review',async (req, res) => {
    try {
        const {buyerId, email, fullName, productId, rating, review} = req.body;

        //check if the user has already reviewed the product
        const existingReview = await productReview.findOne({buyerId, productId});
        if(existingReview){
            return res.status(400).json({message: 'You have already reviewed this product'});
        }

        // create a new review
        const productReviews = new productReview({buyerId, email, fullName, productId, rating, review});
        await productReviews.save();

        // find the product associated with the review using the priductId
        const product = await Product.findById(productId);
        // if the product is not found, return a 404 error
        if(!product){
            return res.status(404).json({message: 'Product not found'});
        }

        // update the totalRatings by incrementing it by 1
        product.totalRatings++;
        // update the averageRating by adding the new rating and dividing by the totalRatings
        product.averageRating = (product.averageRating * (product.totalRatings - 1) + rating) / product.totalRatings;
        // save the updated product back to the database
        await product.save();
        
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