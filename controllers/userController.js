const userService = require("../services/userService");

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    // Ensure user can only update their own profile unless admin
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      });
    }

    const user = await userService.updateUser(req.params.id, req.body);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add a new address for user
// @route   POST /api/users/:id/addresses
// @access  Private
const addUserAddress = async (req, res) => {
  try {
    // Ensure user can only add address to their own profile unless admin
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add address to this user",
      });
    }

    const user = await userService.addUserAddress(req.params.id, req.body);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user address
// @route   PUT /api/users/:id/addresses/:addressId
// @access  Private
const updateUserAddress = async (req, res) => {
  try {
    // Ensure user can only update their own address unless admin
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this address",
      });
    }

    const user = await userService.updateUserAddress(
      req.params.id,
      req.params.addressId,
      req.body
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Set default address
// @route   PUT /api/users/:id/addresses/:addressId/default
// @access  Private
const setDefaultAddress = async (req, res) => {
  try {
    // Ensure user can only set default for their own address unless admin
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      });
    }

    const user = await userService.setDefaultAddress(
      req.params.id,
      req.params.addressId
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove user address
// @route   DELETE /api/users/:id/addresses/:addressId
// @access  Private
const removeUserAddress = async (req, res) => {
  try {
    // Ensure user can only remove their own address unless admin
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to remove this address",
      });
    }

    const user = await userService.removeUserAddress(
      req.params.id,
      req.params.addressId
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = async (req, res) => {
  try {
    // Ensure user can only delete their own account unless admin
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this user",
      });
    }

    await userService.deleteUser(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user's seller status
// @route   PUT /api/users/:id/seller-status
// @access  Private/Admin
const updateSellerStatus = async (req, res) => {
  try {
    // This should be protected by admin middleware
    const { isSellerStatus } = req.body;

    if (typeof isSellerStatus !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isSellerStatus must be a boolean value",
      });
    }

    const user = await userService.updateSellerStatus(
      req.params.id,
      isSellerStatus
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  getUserById,
  updateUser,
  addUserAddress,
  updateUserAddress,
  setDefaultAddress,
  removeUserAddress,
  deleteUser,
  updateSellerStatus,
};
