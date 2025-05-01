const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
      trim: true,
    },
    countyName: {
      type: String,
      required: true,
      trim: true,
    },
    districtName: {
      type: String,
      required: true,
      trim: true,
    },
    addressText: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
