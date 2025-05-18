const express = require('express');
const Product = require('../models/product');
const {auth,vendorAuth} = require('../middleware/auth');
const productRouter = express.Router();

productRouter.post('/api/add-product', auth,vendorAuth, async (req, res) => {
    try {
        const {productName, productPrice,quantity,description, category,vendorId, fullName, subCategory,images} = req.body;
        const product = new Product({productName, productPrice,quantity,description, category, vendorId, fullName, subCategory,images});
        await product.save();
        return res.status(201).send(product);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


productRouter.get('/api/popular-products', async (req, res) => {
    try {
        const popularProducts = await Product.find({popular: true});
        if(!popularProducts || popularProducts.length ==0){
            return res.status(400).json({message: 'No products found'});
        }
        return res.status(200).json(popularProducts);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

productRouter.get('/api/recommended-products', async (req, res) => {
    try {
        const recommendedProducts = await Product.find({recommend: true});
        if(!recommendedProducts || recommendedProducts.length ==0){
            return res.status(400).json({message: 'No products found'});
        }
        return res.status(200).json({recommendedProducts: recommendedProducts});
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

// New route for retrieving products by category
productRouter.get('/api/products-by-category/:category', async(req, res) =>{
    try {
        const {category} = req.params;
        const products = await Product.find({category, popular:true});
        if(!products || products.length == 0){
            return res.status(404).json({msg:"Product not found"});
        }else{
            return res.status(200).json(products)
        }
    } catch (e) {
        res.status(500).json({error: e.message});
    }
})

//new route for retrieving related products by subcategory
productRouter.get('/api/related-products-by-subcategory/:productId', async(req, res) =>{
    try {
        const {productId} = req.params;
        // first find the product to get its subcategory
        const product = await Product.findById(productId);
        if(!product || product.length == 0){
            return res.status(404).json({msg:"Product not found"});
        }else{
            //find related products by subcategory of the retrieved product
            const relatedProducts = await Product.find({
                subCategory: product.subCategory,
                 _id: {$ne: productId}
            }); // Exclude the current product
            if(!relatedProducts || relatedProducts.length == 0){
                return res.status(404).json({msg:"No related products found"});
            }
            return res.status(200).json(relatedProducts)
        }
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
})

// route for retrieving the top 10 highest rated products
productRouter.get('/api/top-rated-products', async(req, res) => {
    try {
        //fetch all products and sort them by average rating in descending order(highest rating first)
        const topRatedProducts = await Product.find({}).sort({averageRating: -1}).limit(3); // sort product by average rating in descending order
        // check if any products were found
        if(!topRatedProducts || topRatedProducts.length == 0){
            return res.status(404).json({msg:"No products found"});
        }else{
            //return the top rated products as a response
            return res.status(200).json(topRatedProducts)
        }
    } catch (e) {
        // handle any server errors that occur during the request
        return res.status(500).json({error: e.message});
    }
})

productRouter.get('/api/products-by-subCategory/:subCategory', async (req, res) => {
    try {
        const {subCategory} = req.params;
        const products = await Product.find({subCategory: subCategory});
        // check if any products were found
        if(!products || products.length == 0){
            return res.status(404).json({msg:"No products found in this subcategory"});
        }else{
            return res.status(200).json(products)
        }
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
})



module.exports = productRouter;