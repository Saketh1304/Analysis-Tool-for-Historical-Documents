const User = require('../model/user.js');
const bcryptjs = require('bcryptjs');
const { errorHandler } = require('../utils/error');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    const { username, email, firstname, lastname, password } = req.body; // Use the field names directly
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, firstname, lastname, password: hashedPassword });

    try {
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, 'secret');
        const { password: _, ...userData } = savedUser.toObject(); // Exclude password from the response
        res.status(201).json({
            ...userData,
            token
        });
    }catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message || error
        });
    }
    
};


const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    const token = jwt.sign({ id: user._id },'secret');
    const { password: _, ...userDetails } = user.toObject();
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({
        ...userDetails,
        token
      });
  } catch (error) {
    next(error);
  }
};

const google = async (req, res, next) => {
  // Implementation stays the same unless further changes are needed
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, 'secret');
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, 'secret');
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  res.clearCookie('access_token');
  res.status(200).json('User has been logged out!');
};

module.exports = {
  register,
  signin,
  google,
  signOut
};

