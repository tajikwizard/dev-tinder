const mongoose = require('mongoose');
const validator = require('validator');
const { signToken } = require('../utils/token');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      validate: {
        validator: function (value) {
          return /^[A-Za-z]+$/.test(value); // Only letters
        },
        message: (props) =>
          `${props.value} contains invalid characters. Only letters are allowed!`,
      },
    },
    lastName: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 8,
      max: 80,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator(value) {
          return validator.isEmail(value);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: 'https://example.com/default.png',
    },
    desc: {
      type: String,
      default: "Hello! I'm new here.",
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

/**
 * INSTANCE METHOD
 * this === current user document
 */
userSchema.methods.getJWT = function () {
  return signToken(this._id);
};
const User = mongoose.model('User', userSchema);
module.exports = User;
