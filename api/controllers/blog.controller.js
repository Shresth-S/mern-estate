import Blog from "../models/blog.model.js";
import errorHandler from "../utils/error.js";

export const createBlog = async (req, res, next) => {
    try {
        console.log("yahanannannan tk aa gye!!");
        const blog = await Blog.create(req.body);
        console.log("blog created successfully!!");
        return res.status(201).json(blog);
    } catch (error) {
        next(error);
    }
}

export const deleteBlog = async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return next(errorHandler(404, 'Blog not found!'));
    }

    if (req.user.id !== blog.userRef) {
        return next(errorHandler(401, 'You can only delete your own blogs!'));
    }

    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json('Blog has been deleted!');
    } catch (error) {
        next(error);
    }
}

export const updateBlog = async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return next(errorHandler(404, 'Blog not found!'));
    }

    if (req.user.id !== blog.userRef) {
        return next(errorHandler(401, 'You can only update your own blogs!'));
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // if we dont do this we will get previous one only not new one
        );
        res.status(200).json(updatedBlog);
    } catch (error) {
        next(error);
    }
}

export const getBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return next(errorHandler(404, 'Blog not found!'));
        }
        res.status(200).json(blog);
    }
    catch (error) {
        next(error);
    }
}

export const getBlogs = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        // let offer = req.query.offer;
        // if (offer === undefined || offer === 'false') {
        //     offer = { $in: [false, true] }; //show blog with and without offers
        // }

        let food = req.query.food;
        if (food === undefined || food === 'false') {
            food = { $in: [false, true] };
        }

        let lifestyle = req.query.lifestyle;
        if (lifestyle === undefined || lifestyle === 'false') {
            lifestyle = { $in: [false, true] };
        }

        let travel = req.query.travel;
        if (travel === undefined || travel === 'false') {
            travel = { $in: [false, true] };
        }

        let technology = req.query.technology;
        if (technology === undefined || technology === 'false') {
            technology = { $in: [false, true] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const blogs = await Blog.find({
            name: { $regex: searchTerm, $options: 'i' }, //regex searches in words and part of words  and $options:'i' means dont care about lowercase and uppercase
            food,
            lifestyle,
            travel,
            technology,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(blogs);
    } catch (error) {
        next(error);
    }
}