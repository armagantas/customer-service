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
      message:
        "User registered successfully. Please check your email for verification code.",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify email with code
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { userId, verificationCode } = req.body;

    if (!userId || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "User ID and verification code are required",
      });
    }

    // Verify email using auth service
    const userData = await authService.verifyEmail(userId, verificationCode);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: userData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Resend verification code
    await authService.resendVerificationCode(userId);

    res.status(200).json({
      success: true,
      message: "Verification code resent. Please check your email.",
    });
  } catch (error) {
    res.status(400).json({
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

    // Check if user is verified
    if (!userData.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Email not verified. Please verify your email before logging in.",
        userId: userData._id,
      });
    }

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
  verifyEmail,
  resendVerification,
  loginUser,
};
