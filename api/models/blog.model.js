import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    // regularPrice: {
    //     type: Number,
    //     required: true,
    // },
    // discountPrice: {
    //     type: Number,
    //     required: true,
    // },
    technology: {
        type: Boolean,
        required: true,
    },
    travel: {
        type: Boolean,
        required: true,
    },
    food: {
        type: Boolean,
        required: true,
    },
    lifestyle: {
        type: Boolean,
        required: true,
    },
    imageUrls: {
        type: Array,
        required: true,
    },
    userRef: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;


// {
// 	"name":"test",
// 	"description":"test",
// 	"author":"test",
// 	"regularPrice":500,
// 	"discountPrice":500,
// 	"bathrooms":5,
// 	"bedrooms":5,
// 	"furnished":true,
// 	"parking":true,
// 	"type":"rent",
// 	"offer":true,
// 	"imageUrls":["hegd","sdgj"],
// 	"userRef": "oweirufvbcnds"
// }