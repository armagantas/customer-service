const User = require("../models/User");
const addressService = require("./addressService");

/**
 * Create a new user with address
 * @param {Object} userData - User data
 * @param {Object} addressData - Address data
 * @returns {Promise<Object>} - Created user with populated address
 */
const createUser = async (userData, addressData) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: userData.email });
    if (userExists) {
      throw new Error("User already exists");
    }

    // Create address first
    const newAddress = await addressService.createAddress(addressData);

    // Create user with address reference
    const user = await User.create({
      ...userData,
      addresses: [newAddress._id],
      defaultAddress: newAddress._id,
    });

    // Populate address in response
    const populatedUser = await User.findById(user._id)
      .populate("addresses")
      .populate("defaultAddress");

    return populatedUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

/**
 * Get user by ID
 * @param {String} id - User ID
 * @returns {Promise<Object>} - Found user with populated addresses
 */
const getUserById = async (id) => {
  try {
    const user = await User.findById(id)
      .populate("addresses")
      .populate("defaultAddress");

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(`Error getting user: ${error.message}`);
  }
};

/**
 * Update a user
 * @param {String} id - User ID
 * @param {Object} userData - New user data
 * @returns {Promise<Object>} - Updated user with populated addresses
 */
const updateUser = async (id, userData) => {
  try {
    // Don't allow updating addresses with this function
    const { addresses, defaultAddress, ...updateData } = userData;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("addresses")
      .populate("defaultAddress");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

/**
 * Add a new address to user
 * @param {String} userId - User ID
 * @param {Object} addressData - New address data
 * @returns {Promise<Object>} - Updated user with populated addresses
 */
const addUserAddress = async (userId, addressData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create new address
    const newAddress = await addressService.createAddress(addressData);

    // Add to user's addresses
    user.addresses.push(newAddress._id);

    // If this is the first address, set it as default
    if (user.addresses.length === 1) {
      user.defaultAddress = newAddress._id;
    }

    await user.save();

    // Return user with populated addresses
    const updatedUser = await User.findById(userId)
      .populate("addresses")
      .populate("defaultAddress");

    return updatedUser;
  } catch (error) {
    throw new Error(`Error adding address: ${error.message}`);
  }
};

/**
 * Update an existing address of a user
 * @param {String} userId - User ID
 * @param {String} addressId - Address ID to update
 * @param {Object} addressData - New address data
 * @returns {Promise<Object>} - Updated user with populated addresses
 */
const updateUserAddress = async (userId, addressId, addressData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if address belongs to user
    if (!user.addresses.includes(addressId)) {
      throw new Error("Address not found for this user");
    }

    // Update address
    await addressService.updateAddress(addressId, addressData);

    // Return user with populated addresses
    const updatedUser = await User.findById(userId)
      .populate("addresses")
      .populate("defaultAddress");

    return updatedUser;
  } catch (error) {
    throw new Error(`Error updating address: ${error.message}`);
  }
};

/**
 * Set an address as the default address
 * @param {String} userId - User ID
 * @param {String} addressId - Address ID to set as default
 * @returns {Promise<Object>} - Updated user with populated addresses
 */
const setDefaultAddress = async (userId, addressId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if address belongs to user
    if (!user.addresses.includes(addressId)) {
      throw new Error("Address not found for this user");
    }

    // Set as default address
    user.defaultAddress = addressId;
    await user.save();

    // Return user with populated addresses
    const updatedUser = await User.findById(userId)
      .populate("addresses")
      .populate("defaultAddress");

    return updatedUser;
  } catch (error) {
    throw new Error(`Error setting default address: ${error.message}`);
  }
};

/**
 * Remove an address from a user
 * @param {String} userId - User ID
 * @param {String} addressId - Address ID to remove
 * @returns {Promise<Object>} - Updated user with populated addresses
 */
const removeUserAddress = async (userId, addressId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if address belongs to user
    const addressIndex = user.addresses.indexOf(addressId);
    if (addressIndex === -1) {
      throw new Error("Address not found for this user");
    }

    // Remove from addresses array
    user.addresses.splice(addressIndex, 1);

    // If it was the default address, set a new default if available
    if (user.defaultAddress.toString() === addressId.toString()) {
      user.defaultAddress =
        user.addresses.length > 0 ? user.addresses[0] : null;
    }

    await user.save();

    // Delete the address
    await addressService.deleteAddress(addressId);

    // Return user with populated addresses
    const updatedUser = await User.findById(userId)
      .populate("addresses")
      .populate("defaultAddress");

    return updatedUser;
  } catch (error) {
    throw new Error(`Error removing address: ${error.message}`);
  }
};

/**
 * Delete a user
 * @param {String} id - User ID
 * @returns {Promise<Boolean>} - True if deleted successfully
 */
const deleteUser = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Delete all associated addresses
    for (const addressId of user.addresses) {
      await addressService.deleteAddress(addressId);
    }

    // Delete user
    await User.findByIdAndDelete(id);

    return true;
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

/**
 * Toggle user's seller status
 * @param {String} userId - User ID
 * @param {Boolean} isSellerStatus - New seller status
 * @returns {Promise<Object>} - Updated user
 */
const updateSellerStatus = async (userId, isSellerStatus) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isSeller: isSellerStatus },
      { new: true, runValidators: true }
    )
      .populate("addresses")
      .populate("defaultAddress");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(`Error updating seller status: ${error.message}`);
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  addUserAddress,
  updateUserAddress,
  setDefaultAddress,
  removeUserAddress,
  deleteUser,
  updateSellerStatus,
};
