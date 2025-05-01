const Address = require("../models/Address");

/**
 * Create a new address
 * @param {Object} addressData - Address data
 * @returns {Promise<Object>} - Created address
 */
const createAddress = async (addressData) => {
  try {
    const address = await Address.create(addressData);
    return address;
  } catch (error) {
    throw new Error(`Error creating address: ${error.message}`);
  }
};

/**
 * Get address by ID
 * @param {String} id - Address ID
 * @returns {Promise<Object>} - Found address
 */
const getAddressById = async (id) => {
  try {
    const address = await Address.findById(id);
    if (!address) {
      throw new Error("Address not found");
    }
    return address;
  } catch (error) {
    throw new Error(`Error getting address: ${error.message}`);
  }
};

/**
 * Update an address
 * @param {String} id - Address ID
 * @param {Object} addressData - New address data
 * @returns {Promise<Object>} - Updated address
 */
const updateAddress = async (id, addressData) => {
  try {
    const address = await Address.findByIdAndUpdate(id, addressData, {
      new: true,
      runValidators: true,
    });
    if (!address) {
      throw new Error("Address not found");
    }
    return address;
  } catch (error) {
    throw new Error(`Error updating address: ${error.message}`);
  }
};

/**
 * Delete an address
 * @param {String} id - Address ID
 * @returns {Promise<Boolean>} - True if deleted successfully
 */
const deleteAddress = async (id) => {
  try {
    const address = await Address.findByIdAndDelete(id);
    if (!address) {
      throw new Error("Address not found");
    }
    return true;
  } catch (error) {
    throw new Error(`Error deleting address: ${error.message}`);
  }
};

module.exports = {
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
};
