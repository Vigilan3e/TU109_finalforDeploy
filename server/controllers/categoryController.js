import Category from "../models/Category.js";
import ProductModel from "../models/Product.js"

const addCategory = async (req,res) => {
    try {
        const { categoryName, categoryDescription } = req.body;
        
        const existingCategory = await Category.findOne({ categoryName });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: 'Category already exists'});   
        }

        const newCategory = new Category({
            categoryName,
            categoryDescription,
        });

        await newCategory.save()
        return res.status(201).json({ success: true, message: 'Category added successfully!' });
    } catch (error) {
        console.log('Error adding category:', error);
        return  res.status(500).json({ success: false, message: 'Server error'});
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({ success: true, categories});
    } catch (error) {
        console.log('Error fetching categories:', error);
        return res.status(500).json({ success: false, message: "Server error is getting categories"})
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName, categoryDescription } = req.body;

        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({ success: false, message: 'Category not found'});
        }

        const updateCategory = await Category.findByIdAndUpdate(
            id,
            {categoryName, categoryDescription },
            { returnDocument: 'after' }
        );
        return res.status(200).json({success: true, message: 'Category update successfully'});
    } catch (error) {
        console.log('Error updating category: ', error);
        return res.status(500).json({success: false, message: 'Server error'});
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const productCount = await ProductModel.countDocuments({categoryId: id});

        if(productCount > 0) {
            return res.status(400).json({success: false, message: "Cannot delete category associated with products"});
        }

        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({ success: false, message: 'Category not found'});
        }

        await Category.findByIdAndDelete(id);
        return res.status(200).json({success: true, message: 'Category delete successfully'});
    } catch (error) {
        console.log('Error deleting category: ', error);
        return res.status(500).json({success: false, message: 'Server error'});
    }
}

export {addCategory, getCategories, updateCategory, deleteCategory};