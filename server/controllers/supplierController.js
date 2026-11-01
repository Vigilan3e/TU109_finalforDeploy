import Supplier from "../models/Supplier.js";
import ProductModel from "../models/Product.js"

const addSupplier = async (req,res) => {
    try {
        const { name, email, phone, number, address  } = req.body;

        const phoneNumber = number || phone;
        
        const existingSupplier = await Supplier.findOne({ name });
        if (existingSupplier) {
            return res.status(400).json({ success: false, message: 'Supplier already exists'});   
        }

        const newSupplier = new Supplier({
            name,
            email,
            number: phoneNumber,
            address
        });

        await newSupplier.save()
        return res.status(201).json({ success: true, message: 'Supplier added successfully!' });
    } catch (error) {
        console.log('Error adding supplier:', error);
        return  res.status(500).json({ success: false, message: 'Server error'});
    }
}

const getSupplier = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        return res.status(200).json({ success: true, suppliers});
    } catch (error) {
        console.log('Error fetching suppliers:', error);
        return res.status(500).json({ success: false, message: "Server error is getting suppliers"})
    }
}

const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, number, address } = req.body;

        const existingSupplier = await Supplier.findById(id);
        if (!existingSupplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found'});
        }

        const updateSupplier = await Supplier.findByIdAndUpdate(
            id,
            {name, email, number,address },
            { new: true }
        );
        return res.status(200).json({success: true, message: 'Supplier update successfully'});
    } catch (error) {
        console.log('Error updating category: ', error);
        return res.status(500).json({success: false, message: 'Server error'});
    }
}

const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        const productCount = await ProductModel.countDocuments({supplierId: id});
        
                if(productCount > 0) {
                    return res.status(400).json({success: false, message: "Cannot delete supplier associated with products"});
                }

        const existingSupplier = await Supplier.findById(id);
        if (!existingSupplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found'});
        }

        await Supplier.findByIdAndDelete(id);
        return res.status(200).json({success: true, message: 'Supplier delete successfully'});
    } catch (error) {
        console.log('Error deleting Supplier: ', error);
        return res.status(500).json({success: false, message: 'Server error'});
    }
}

export {addSupplier, getSupplier, updateSupplier, deleteSupplier};