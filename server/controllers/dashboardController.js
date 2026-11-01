import Product from "../models/Product.js"

const getData = async (req, res) => {

    try {
    const totalProducts = await Product.countDocuments();

   const stockResult = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalStock: { 
                        $sum: { $ifNull: ["$stock", 0] } 
                    },
                    totalValue: { 
                        $sum: { 
                            $multiply: [
                                { $ifNull: ["$price", 0] }, 
                                { $ifNull: ["$stock", 0] }
                            ] 
                        } 
                    }
                }
            }
        ]);

    const totalStock = stockResult.length > 0 ? stockResult[0].totalStock : 0;
    const totalValue = stockResult.length > 0 ? stockResult[0].totalValue : 0;

    const outOfStock = await Product.find({stock: 0})
    .select('name stock price categoryId')
    .populate('categoryId', 'categoryName name')


    const lowStock = await Product.find({stock: {$gt: 0,$lte: 5}})
    .select("name stock price categoryId")
    .populate("categoryId", "categoryName name")

    const dashboardData = {
        totalProducts,
        totalStock,
        totalValue,
        outOfStock,
        lowStock
    }

    return res.status(200).json({success:true, dashboardData})
} catch (error) {
    console.error("Dashboard Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetching dashboard summary",
            error: error.message
        });
}

}

export {getData};