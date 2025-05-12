const express = require('express');
const Product = require('../models/product');

const productRouter = express.Router();

productRouter.post('/api/add-product', async (req, res) => {
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
module.exports = productRouter;