import User from '../models/Users.js';
import Blog from '../models/blog.model.js';
import {errorHandler} from '../utils/error.js';
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.send("Hello world1234");
};

export const updateUser =async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account!"));

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            },
        }, { new: true }); //new:true return new updated info otherwise old information would have been returned
        
        const { password, ...rest } = updatedUser._doc;

        res.status(200).json(rest);
    
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account!'))
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error);
    }
};

export const getUserBlogs = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const blogs = await Blog.find({ userRef: req.params.id });
            res.status(200).json(blogs);
        } catch (error) {
            next(error);
        }
    }
    else {
        return next(errorHandler(401, 'You can only view your blogs!'));
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return next(errorHandler(404, 'User not found!'));
    
        const { password: pass, ...rest } = user._doc;
    
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}