
import React, { useEffect, useState } from 'react'
import api from '../utils/api';

const Products = () => {
    const [openModal, setOpenModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        supplierId: "",
    });
 
    const fetchProducts = async () => {
        try {
                const response = await api.get("/api/products");
                if (response.data.success) {
                    setSuppliers(response.data.suppliers || []);
                    setCategories(response.data.categories || []);
                    setProducts(response.data.products || []);
                    setFilteredProducts(response.data.products || []);
                } else {
                    console.error("Error fetching products:", response.data.message);
                    alert("Error fetching products. Please try again.");
                }
                
            } catch (error) {
                console.log("Error fetching suppliers:", error);
            }
    }

    useEffect(() => {
        fetchProducts();
    }, []); 

    const handleChange = (e) => {
    const {name , value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
   };

   const handleEdit = (product) => {
    setOpenModal(true);
    setEditProduct(product._id);
    setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId._id,
        supplierId: product.supplierId._id,
    });
   };

   const handleDelete = async (id) => {
           const confirmDelete = window.confirm(
               "Are you sure you want to delete this Product?");
               if (confirmDelete) {
                   try {
                       const response = await api.delete(
                           `/api/products/${id}`
                       );
                       if (response.data.success) {
                           alert("Products deleted successfully!");
                           fetchProducts();
                       }else {
                           console.error("Error deleting product:",response.data);
                           alert("Error deleting product. Please try again.");
                       }
                   } catch (error) {
                       console.error("Error deleting product:", error);
                           alert("Error deleting product. Please try again.");
                   }
               }
       };

   const closeModel = () => {
        setOpenModal(false);
        setEditProduct(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            categoryId: "",
            supplierId: "",
    });
   }

    const handleSubmit = async (e) => {
    e.preventDefault();

    if(editProduct) {
        try {
            const response = await api.put(
                `/api/products/${editProduct}`,
                formData
            );
            if (response.data.success) {
                alert("Product updated successfully!");
                closeModel();
                fetchProducts();
            } else {
                alert("Error updating Product. Please try again.");
            }
        } catch (error) {
            alert("Error updating Product. Please try again.")
        }
        return;
    }
    else {
    
    try {
    const response = await api.post(
        "/api/products/add",
            formData
        );
        if (response.data.success) {
            alert("Product added successfully!");
            closeModel();
            fetchProducts();
        } else {
            // console.log("Error adding category:", response.data);
            alert("Error adding Product please try again.");
        }
    } catch (error) {
        //  console.log("Error adding supplier:", error.message);
        alert("Error adding Product please try again.");
    }
}
};

const handleSearch = (e) => {
    setFilteredProducts(
            products.filter((product) =>
            product.name.toLowerCase().includes(e.target.value.toLowerCase())
        ))
}

  return (
    <div className='w-full h-full flex flex-col gap-4 p-4'>
        <h1 className='text-2xl font-bold'>Product Management</h1>
        <div className='flex justify-between items-center'>
            <input type="text" placeholder='Search' className='border p-1 bg-white rounded px-4' 
            onChange={handleSearch} 
            />
            <button className='px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600'
            onClick={() => setOpenModal(true)}
            >Add Product
            </button>
        </div>

        <div>
            <table className='w-full border-collapse border border-gray-300 mt-4'>
                <thead>
                    <tr className='bg-gray-200'>
                        <th className='border border-gray-300 p-2'>S NO</th>
                        <th className='border border-gray-300 p-2'>Product Name</th>
                        <th className='border border-gray-300 p-2'>Category Name</th>
                        <th className='border border-gray-300 p-2'>Supplier Name</th>
                        <th className='border border-gray-300 p-2'>Price</th>
                        <th className='border border-gray-300 p-2'>Stock</th>
                        <th className='border border-gray-300 p-2'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts && filteredProducts.map((product, index) => (
                        <tr key={product._id}>
                            <td className='border border-gray-300 p-2'>{index + 1}</td>
                            <td className='border border-gray-300 p-2'>{product.name}</td>
                            <td className='border border-gray-300 p-2'>{product.categoryId?.categoryName || product.categoryId?.name || "-"}</td>
                            <td className='border border-gray-300 p-2'>{product.supplierId?.name || "-"}</td>
                            <td className='border border-gray-300 p-2'>{product.price}</td>
                            <td className='border border-gray-300 p-2'>
                                <span className="rounded-full font-semibold">
                                    {product.stock == 0 ? (
                                        <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full">{product.stock}</span>
                                    ) : product.stock < 5 ? (
                                        <span className='bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full'>{product.stock}</span>
                                    ) : (<span className='bg-green-100 text-green-500 px-2 py-1 rounded-full'>{product.stock}</span>)}
                                </span>
                            </td>
                            <td className='border border-gray-300 p-2 text-center'>
                                <button className='px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer mr-2'
                                onClick={() => handleEdit(product) }>Edit</button>
                                <button className='px-2 py-1 bg-red-500 text-white rounded cursor-pointer'
                                onClick={() => handleDelete(product._id)}
                                >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredProducts.length === 0 && <div>No records</div>}
            </div>

        {openModal && (
             <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center'>
                <div className="bg-white p-6 rounded shadow-md w-1/3 relative">
                <h1 className="text-xl font-bold" >{editProduct ? "Edit Product" : "Add Product"}</h1>
                    <button className="absolute top-4 right-4 font-bold text-lg cursor-pointer" onClick={closeModel}>X</button>
                    <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
                        <input type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Product Name' 
                        className="border p-1 bg-white rounded px-4" />
                        <input type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder='Description'
                        className="border p-1 bg-white rounded px-4" />
                        <input type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                         placeholder='Enter Price' 
                         className="border p-1 bg-white rounded px-4" />
                        <input type="number"
                        name="stock"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange} 
                        placeholder='Enter stock' 
                        className="border p-1 bg-white rounded px-4" />

                        <div className="w-full border">
                            <select name="categoryId" className="w-full p-2" onChange={handleChange} value={formData.categoryId}>
                                <option value="">Select Category</option>
                                {categories && 
                                categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.categoryName || category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full border">
                            <select name="supplierId" className="w-full p-2"
                            onChange={handleChange} value={formData.supplierId}>
                                <option value="">Select Supplier</option>
                                {suppliers && suppliers.map((supplier) => (
                                    <option key={supplier._id} value={supplier._id}>
                                        {supplier.name}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div className='flex space-x-2'>               
                        <button 
                        type='submit'
                        className='w-full mt-2 rounded-md bg-green-600 text-white p-3 cursor-pointer hover:bg-green-700'
                        >
                         {editProduct ? "Save Changes" : "Add Product"}
                        </button>
                            
                                <button
                                type='button'
                                className='w-full mt-2 rounded-md bg-red-500 text-white p-3 cursor-pointer hover:bg-red-600'
                                onClick={closeModel}
                                >
                                Cancel
                                </button>
                            
                    
                        </div>
                    </form>
                </div>
            </div>
        )}

    </div>
  )
}

export default Products