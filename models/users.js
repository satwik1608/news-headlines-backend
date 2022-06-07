const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 2555,
  },
  about: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
  },
  anime: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 50,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      about: this.about,
      anime: this.anime,
      isAdmin: this.isAdmin,
    },
    process.env.headlines_jwtPrivateKey
  );
  return token;
};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    about: Joi.string().min(10).max(1000).required(),
    anime: Joi.string().min(3).max(50),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(user, schema);
}
exports.User = User;
exports.validate = validateUser;
