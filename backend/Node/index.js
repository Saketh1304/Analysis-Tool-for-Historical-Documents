const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./model/user.js');
const bcryptjs = require('bcryptjs');
// const bcrypt=require('bycrypt');
// const userRouter = require('./routes/user.route.js');
// const authRouter = require('./routes/auth.route.js');
// const listingRouter = require('./routes/listing.route.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// This will allow all domains to access your backend
// For production, you might want to restrict this to certain domains

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

  

const app = express();
app.use(cors());
app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

// app.use('/api/user', userRouter);
app.post('/api/auth/register',async (req, res, next) => {
    const { username, email, firstname, lastname, password } = req.body; // Use the field names directly
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, firstname, lastname, password: hashedPassword });

    try {
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET);
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
        })
    
    }
})

// Login endpoint corrected
app.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const validPassword = await bcryptjs.compare(password, validUser.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Wrong credentials." });
        }

        const token = jwt.sign({ id: validUser._id }, JWT_SECRET, { expiresIn: '1h' });
        // Ensure not to send back the password or other sensitive details
        const { password: _, ...userDetails } = validUser.toObject();

        res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json({
          ...userDetails,
          token
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.get('/api/auth/users/me', async (req, res, next) => {
    try {
        
        const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1]; // Improved token extraction
        console.log(token);
        if (!token) return res.status(401).send({ message: 'No token provided' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) return res.status(404).send({ message: 'User not found' });

        const { password, ...userWithoutPassword } = user.toObject(); // Exclude password from the response
        res.json(userWithoutPassword);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ message: 'Invalid token' });
        }
        next(error); // Pass errors to error-handling middleware
    }
});

app.post('/api/auth/user/upload', async (req, res) => {
    const { userId, documentName } = req.body;
  
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        
        // Check if the document name already exists in the uploads array
        // if (user.uploads.includes(documentName)) {
        //     return res.status(409).send('Document already uploaded'); // 409 Conflict
        // }
        
        user.uploads.push(documentName);
        await user.save();
        res.status(200).send('Upload added successfully');
    } catch (error) {
        res.status(500).send('Error updating user uploads: ' + error.message);
    }
});



   




// General error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});