import User from '../models/Users.js'
import bcryptjs from 'bcryptjs';
import errorHandler from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res,next) => {
    // console.log(req.body);
    const { username, email, password } = req.body;
    // const hashedPassword = await bcryptjs.hashSync(password, 10);
    // const newUser = new User({ username, email, password: hashedPassword });
    try {
        const hashedPassword = await bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json("User created successfully!");
    }
    catch (error) {
        next(error);
    }

};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not Found!'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Invalid Login Credentials!'));
        const token = jwt.sign({ id: validUser._id },process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res
            .cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 7) })
            .status(200)
            .json(rest); // httpOnly:true means only our website will have access to this cookie , no third party app will have access to it
    } catch (error) {
        next(error);
    }
}
