import { generateTokenRegister } from '../config/generateToken.js';
import { validateUserLogin, validateUserRegister } from '../config/validateUsersSchema.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import Resume from '../models/Resume.js';

// Register User: POST: /api/user/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input data
    const { error } = validateUserRegister(req.body);
    if (error) {
      return res.status(400).json({ message: error.details.map((d) => d.message).join(', ') });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    //Generate token
    const token = generateTokenRegister(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//Login User : Post: /api/user/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = validateUserLogin(req.body);
    if (error) {
      return res.status(400).json({ message: error.details.map((d) => d.message).join(', ') });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // IMPORTANT: await the comparePassword result
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateTokenRegister(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// get user by id: GET: /api/user/:id
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId; // get the userID from the authenticated request middleware

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(userId).select('-password');

    //Validate user existence
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //send the response
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//getting user resume: GET: /api/user/resume
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;
    //return user resumes
    const resumes = await Resume.find({ userId });

    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const googleLoginOrRegister = async (req, res) => {
  const { name, email, from } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      // If this request came from the signup page, tell client the user already exists
      if (from === 'register') {
        return res.status(409).json({ message: 'User already exists with this email' });
      }

      // Otherwise (default) behave as before: login existing user
      const token = generateTokenRegister(user);
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } else {
      // create new user (same as before)
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      console.log('randomPassword:', randomPassword);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      const token = generateTokenRegister(newUser);

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
      });
    }
  } catch (error) {
    console.error('Error in Google login/register:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
