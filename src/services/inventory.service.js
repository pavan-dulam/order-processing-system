const Inventory = require('../models/inventory.model');

exports.checkStock = async (items) => {
    for (let item of items) {
        console.log(item);
        const productId = item?.productId
        const product = await Inventory.findOne({ "productId": productId });
        console.log(product);
        if (!product || product.stock <= 0) {
            return false;
        }
    }
    return true;
};
