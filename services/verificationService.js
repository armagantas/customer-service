const Verification = require("../models/Verification");
const User = require("../models/User");
const emailService = require("./emailService");

/**
 * Generate a random 6-digit verification code
 * @returns {String} The generated code
 */
const generateVerificationCode = () => {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Create a verification record and send verification email
 * @param {String} userId - User ID
 * @param {String} email - User's email address
 * @returns {Promise<Object>} Verification object (without code for security)
 */
const createVerification = async (userId, email) => {
  try {
    // Generate verification code
    const code = generateVerificationCode();

    // Delete any existing verification for this user
    await Verification.deleteMany({ userId });

    // Create new verification
    const verification = await Verification.create({
      userId,
      email,
      code,
    });

    // Send verification email
    await emailService.sendVerificationEmail(email, code);

    // Return verification object without code for security
    const verificationData = verification.toObject();
    delete verificationData.code;

    return verificationData;
  } catch (error) {
    throw new Error(`Error creating verification: ${error.message}`);
  }
};

/**
 * Verify user's email with verification code
 * @param {String} userId - User ID
 * @param {String} code - Verification code
 * @returns {Promise<Boolean>} True if verification is successful
 */
const verifyEmail = async (userId, code) => {
  try {
    // Find verification by user ID and code
    const verification = await Verification.findOne({
      userId,
      code,
      expiresAt: { $gt: Date.now() }, // Make sure it's not expired
    });

    if (!verification) {
      throw new Error("Invalid or expired verification code");
    }

    // Update verification
    verification.verified = true;
    await verification.save();

    // Update user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.isVerified = true;
    await user.save();

    return true;
  } catch (error) {
    throw new Error(`Verification error: ${error.message}`);
  }
};

/**
 * Resend verification code
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Verification object (without code for security)
 */
const resendVerificationCode = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // If user is already verified, no need to resend
    if (user.isVerified) {
      throw new Error("User is already verified");
    }

    return await createVerification(userId, user.email);
  } catch (error) {
    throw new Error(`Error resending verification: ${error.message}`);
  }
};

module.exports = {
  createVerification,
  verifyEmail,
  resendVerificationCode,
};
