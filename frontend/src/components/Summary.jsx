
import React, { useState, useEffect } from 'react'
import api from '../utils/api';


const Summary = () => {
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalStock: 0,
        revenue: 0,
        outOfStock: [],
        lowStock: []       
    })
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/dashboard');
            if (response.data.success) {
                const data = response.data.dashboardData || response.data;
                setDashboardData({
                    totalProducts: data.totalProducts || 0,
                    totalStock: data.totalStock || 0,
                    totalValue: data.totalValue || 0,
                    outOfStock: Array.isArray(data.outOfStock) ? data.outOfStock : [],
                    lowStock: Array.isArray(data.lowStock) ? data.lowStock : []
                });
            }
        } catch (error) {
                alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if(loading) {
        return <div>Loading...</div>
    }


    return (
        <div className='p-5'>
            <h2 className='text-3xl font-bold'>Dashboard</h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6'>
                <div className='bg-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center'>
                    <p className='text-lg font-semibold'>Total Products</p>
                    <p className='text-2xl font-bold'>{dashboardData.totalProducts}</p>
                </div>
                 <div className='bg-green-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center'>
                    <p className='text-lg font-semibold'>Total Stock</p>
                    <p className='text-2xl font-bold'>{dashboardData.totalStock}</p>
                </div>
                <div className='bg-yellow-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center'>
                    <p className='text-lg font-semibold'>Total Inventory Value</p>
                    <p className='text-2xl font-bold'>{(dashboardData.totalValue || 0).toLocaleString()} ฿</p>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-white p-4 rounded-lg shadow-md'>
                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Out Of Stock Products</h3>
                {(dashboardData.outOfStock?.length || 0) > 0 ? (
                    <ul className='space-y-2'>
                        {dashboardData.outOfStock.map((product, index) => (
                            <li key={index} className='text-gray-600'>
                                {product.name}{""}
                                <span className='text-gray-400'>({product.category.name})</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className='text-gray-500'>No products out of stock.</p>
                )} 
            </div>
            
            <div className='bg-white p-4 rounded-lg shadow-md'>
                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Low Stock Products</h3>
                {(dashboardData.lowStock?.length || 0) > 0 ? (
                    <ul className='space-y-2'>
                        {dashboardData.lowStock.map((product, index) => (
                            <li key={index} className='text-gray-600'>
                                <strong>{product.name}</strong> - {product.stock} left{""}
                                <span className='text-gray-400'>({product.categoryId?.categoryName || product.categoryId?.name || "No Category"})</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className='text-gray-500'>No low stock products.</p>
                )} 
            </div>
            </div>
        </div>
    )
}

export default Summary;