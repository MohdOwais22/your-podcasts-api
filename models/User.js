import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter Name'],
  },

  email: {
    type: String,
    required: [true, 'Please Enter Email'],
    unique: [true, 'Email Already Exist'],
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, 'Please Enter Password'],
    minLength: [6, 'Password must be at least 6 characters long'],
    select: false,
  },

  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  avatar: {
    public_id: String,
    url: String,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Podcast',
    },
  ],
});

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

schema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });
};

export const User = mongoose.model('User', schema);
