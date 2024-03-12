import User from '../models/Users.js'
import bcryptjs from 'bcryptjs';

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