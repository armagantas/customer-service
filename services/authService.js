const jwt = require("jsonwebtoken");
const User = require("../models/User");
const userService = require("./userService");

/**
 * Register a new user
 * @param {Object} userData - User data (email, password, firstName, lastName)
 * @param {Object} addressData - Address data
 * @returns {Promise<Object>} - Registered user data without password
 */
const registerUser = async (userData, addressData) => {
  try {
    const { email, password, firstName, lastName } = userData;

    // Create user with address
    const user = await userService.createUser(
      { email, password, firstName, lastName },
      addressData
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
  } catch (error) {
    throw new Error(`Registration error: ${error.message}`);
  }
};

/**
 * Login user and generate JWT token
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Promise<Object>} - User data with token
 */
const loginUser = async (email, password) => {
  try {
    // Find user by email
    const user = await User.findOne({ email })
      .populate("addresses")
      .populate("defaultAddress");

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      ...userResponse,
      token,
    };
  } catch (error) {
    throw new Error(`Login error: ${error.message}`);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
