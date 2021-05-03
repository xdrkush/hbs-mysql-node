const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Category = require('./Category-model')

// Indiquer ici ce qui se trouvera dans la base de connées.
const ProductSchema = new mongoose.Schema({
    title: String,
    content: String,
    price: Number,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    cover: {
        name: String,
        originalName: String,
        path: String,
        urlSharp: String,
        createAt: Date
    }
});

module.exports = mongoose.model("Product", ProductSchema)
