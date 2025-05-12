const express = require('express');
const SubCategory = require('../models/sub_category');

const SubCategoryRouter = express.Router();

SubCategoryRouter.post('/api/subcategories', async (req, res) => {
    try {
        const {categoryId, categoryName, image, subCategoryName} = req.body;
        const subcategory = new SubCategory({categoryId, categoryName, image, subCategoryName});
        await subcategory.save();
        return res.status(201).send(subcategory);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});
SubCategoryRouter.get('/api/subcategories',async (req, res) => {
    try {
        const subcategories = await SubCategory.find();
        return res.status(200).json(subcategories);
    } catch (e) {
        return res.status(500).json({error: e.message});
    }
});

SubCategoryRouter.get('/api/category/:categoryName/subcategories', async (req, res) => {
    //extract categoryName from the request URL using destructuring 
    const {categoryName} = req.params;
    try {
        const subcategories = await SubCategory.find({categoryName: categoryName});

        // Check if any subcategories were found
        if (!subcategories || subcategories.length == 0) {
            // if no subcategories were found, respond with a status code 404 error
            return res.status(404).json({message: 'No subcategories found for this category'});
        }
        return res.status(200).json({subcategories});

    } catch (e) {
        res.status(500).json({error: e.message});
    }
});
module.exports = SubCategoryRouter;

