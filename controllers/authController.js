const authService = require("../services/authService");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, address } = req.body;

    // Register user using auth service
    const userData = await authService.registerUser(
      { email, password, firstName, lastName },
      address
    );

    res.status(201).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Login user using auth service
    const userData = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
